"""Extract the supplied atlas as research data, without executing its HTML/JS.
Usage: python3 scripts/import-night-drive-atlas.py /path/to/source.html
"""
import hashlib
import json
from html.parser import HTMLParser
from pathlib import Path
import sys
from urllib.parse import urlsplit, parse_qs


class Node:
    def __init__(self, tag="", attrs=()):
        self.tag, self.attrs, self.children = tag, dict(attrs), []

    def text(self):
        return "".join(c if isinstance(c, str) else c.text() for c in self.children).strip()

    def find(self, cls=None, tag=None):
        result = []
        for child in self.children:
            if isinstance(child, Node):
                if (cls is None or cls in child.attrs.get("class", "").split()) and (tag is None or child.tag == tag):
                    result.append(child)
                result.extend(child.find(cls, tag))
        return result

    def first_text(self, cls=None, tag=None):
        found = self.find(cls, tag)
        return found[0].text() if found else ""


class Document(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.root = Node()
        self.stack = [self.root]
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        node = Node(tag, attrs)
        self.stack[-1].children.append(node)
        if tag not in {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}:
            self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        self.handle_endtag(tag)

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i].tag == tag:
                del self.stack[i:]
                break

    def handle_data(self, data):
        self.stack[-1].children.append(data)


def stop(node, identity, extra=False):
    title = node.find("extra-title")[0] if extra else node.find(tag="h4")[0]
    name = "".join(c for c in title.children if isinstance(c, str)).strip()
    links = [{"label": a.text(), "url": a.attrs["href"]} for a in node.find(tag="a")]
    assert name and links
    for link in links:
        url = urlsplit(link["url"])
        assert (url.scheme, url.netloc, url.path) in {("https", "uri.amap.com", "/search"), ("iosamap", "path", "")}, link
    navigation = parse_qs(urlsplit(next(link["url"] for link in links if link["url"].startswith("iosamap:"))).query)
    search = parse_qs(urlsplit(next(link["url"] for link in links if link["url"].startswith("https:"))).query)
    return {"id": identity, "name": name, "mode": node.first_text("mode"), "note": node.first_text("stop-note"),
            "navigationName": navigation["dname"][0], "searchName": search["keyword"][0]}


def main():
    source_path = Path(sys.argv[1])
    source = source_path.read_bytes()
    root = Document(source.decode("utf-8")).root
    cities = []
    for city in root.find("city"):
        routes = []
        for route in city.find("city-route"):
            routes.append({"id": route.attrs["id"], "name": route.first_text(tag="h3"),
                           "direction": route.first_text("route-direction"), "note": route.first_text("route-focus"),
                           "stops": [stop(s, s.attrs["id"]) for s in route.find("stop")]})
        sources = city.find("city-sources")[0]
        cities.append({"id": city.attrs["id"], "name": city.attrs["data-city"], "province": city.first_text("province"),
                       "advice": city.first_text("city-advice"), "routes": routes,
                       "extras": [stop(s, f'{city.attrs["id"]}-extra-{i + 1}', True) for i, s in enumerate(city.find("extra"))],
                       "sourceNote": sources.first_text(tag="p"),
                       "sources": [{"label": a.text(), "url": a.attrs["href"]} for a in sources.find(tag="a")]})
        # Check every stored source link against the compact fields before dropping repeated URLs.
        for route_node, route in zip(city.find("city-route"), routes):
            for index, (node, point) in enumerate(zip(route_node.find("stop"), route["stops"])):
                leg = parse_qs(urlsplit(node.find("leglink")[0].attrs["href"]).query)
                assert leg.get("sname") == ([route["stops"][index - 1]["navigationName"]] if index else None)
        for node, point in zip([*city.find("stop"), *city.find("extra")], [*(p for r in routes for p in r["stops"]), *cities[-1]["extras"]]):
            for link in node.find(tag="a"):
                url = urlsplit(link.attrs["href"])
                params = parse_qs(url.query)
                if url.scheme == "iosamap":
                    assert params["dname"] == [point["navigationName"]]
                    assert {k: v for k, v in params.items() if k not in {"dname", "sname"}} == {"sourceApplication": ["NightDriveAtlas"], "t": ["0"], "m": ["0"], "dev": ["0"]}
                else:
                    assert params["keyword"] in [[point["searchName"]], [point["searchName"] + " 停车场"]]
                    assert {k: v for k, v in params.items() if k != "keyword"} == {"city": [city.attrs["data-city"]], "view": ["map"], "src": ["NightDriveAtlas"], "callnative": ["0"]}
    counts = (len(cities), sum(len(c["routes"]) for c in cities), sum(len(r["stops"]) for c in cities for r in c["routes"]), sum(len(c["extras"]) for c in cities))
    assert counts == (60, 67, 653, 267), counts
    scope = next(node for node in root.find(tag="details") if node.attrs.get("id") == "scope")
    result = {"schemaVersion": "1.0.0", "source": {"fileName": source_path.name, "sha256": hashlib.sha256(source).hexdigest(),
              "date": "2026-09-28", "conversationUrl": "https://chatgpt.com/c/6a99164f-0d90-83ea-b962-da380bcdcee4",
              "scope": [node.text() for node in scope.find(tag="p")], "references": [{"label": a.text(), "url": a.attrs["href"]} for a in scope.find(tag="a")],
              "status": "unverified", "note": "用户提供的城市夜景拍摄研究清单；无精确坐标。路线顺序为编辑建议，导航名称由高德实时解析，未核实当晚亮灯、停车入口和实际通行。"}, "cities": cities}
    output = Path(__file__).resolve().parents[1] / "data/night-drive-atlas.json"
    output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
    points = [(c["name"], s["name"]) for c in cities for s in [*(s for r in c["routes"] for s in r["stops"]), *c["extras"]]]
    print(f"Imported cities/routes/stops/extras: {counts}; {len(set(points))} distinct city/name pairs")


if __name__ == "__main__":
    main()
