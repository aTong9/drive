import assert from "node:assert/strict";
import test from "node:test";
import { ordinaryCreatorVerticalModelsBatch30 } from "../data/ordinaryCreatorVerticalModelsBatch30.js";
import { ordinaryCreatorVerticalModelsBatch50 } from "../data/ordinaryCreatorVerticalModelsBatch50.js";
import { ordinaryCreatorVerticalModelsBatch50B } from "../data/ordinaryCreatorVerticalModelsBatch50B.js";
import { ordinaryCreatorVerticalModelsBatch90 } from "../data/ordinaryCreatorVerticalModelsBatch90.js";
import { ordinaryCreatorLifeStageModels } from "../data/ordinaryCreatorLifeStageModels.js";
import { ordinaryCreatorPerspectiveModels } from "../data/ordinaryCreatorPerspectiveModels.js";
import {
  ordinaryCreatorCollections,
  ordinaryCreatorDiscoveryDate,
  recentOrdinaryCreatorDiscoveryIds,
} from "../data/ordinaryCreatorCollections.js";
import { ordinaryCreatorNarrativeMechanismModels } from "../data/ordinaryCreatorNarrativeMechanismModels.js";
import { ordinaryCreatorRuleDrivenModels } from "../data/ordinaryCreatorRuleDrivenModels.js";
import { ordinaryCreatorServiceWorkModels } from "../data/ordinaryCreatorServiceWorkModels.js";
import { ordinaryCreatorRecoveryJourneyModels } from "../data/ordinaryCreatorRecoveryJourneyModels.js";
import { ordinaryCreatorWorkplaceDiaryModels } from "../data/ordinaryCreatorWorkplaceDiaryModels.js";
import { ordinaryCreatorLocalUtilityModels } from "../data/ordinaryCreatorLocalUtilityModels.js";
import { ordinaryCreatorEvidenceArchiveModels } from "../data/ordinaryCreatorEvidenceArchiveModels.js";
import { ordinaryCreatorCompanionAnimalModels } from "../data/ordinaryCreatorCompanionAnimalModels.js";
import { ordinaryCreatorCommunityOrganizerModels } from "../data/ordinaryCreatorCommunityOrganizerModels.js";
import { ordinaryCreatorCivicProcessModels } from "../data/ordinaryCreatorCivicProcessModels.js";
import { ordinaryCreatorLivingLanguageModels } from "../data/ordinaryCreatorLivingLanguageModels.js";
import { ordinaryCreatorEmergencyReadinessModels } from "../data/ordinaryCreatorEmergencyReadinessModels.js";
import { ordinaryCreatorCollaborativeArtsModels } from "../data/ordinaryCreatorCollaborativeArtsModels.js";
import { ordinaryCreatorNeighborhoodSupportModels } from "../data/ordinaryCreatorNeighborhoodSupportModels.js";
import { ordinaryCreatorCommunityMeasurementModels } from "../data/ordinaryCreatorCommunityMeasurementModels.js";
import { ordinaryCreatorLocalMemoryArchiveModels } from "../data/ordinaryCreatorLocalMemoryArchiveModels.js";
import { ordinaryCreatorParticipatoryLibraryModels } from "../data/ordinaryCreatorParticipatoryLibraryModels.js";
import { ordinaryCreatorParticipatoryLocalMediaModels } from "../data/ordinaryCreatorParticipatoryLocalMediaModels.js";
import { ordinaryCreatorCommunityBiodiversityModels } from "../data/ordinaryCreatorCommunityBiodiversityModels.js";
import { ordinaryCreatorAccessibleContentCoDesignModels } from "../data/ordinaryCreatorAccessibleContentCoDesignModels.js";
import { ordinaryCreatorCommunitySportsRolesModels } from "../data/ordinaryCreatorCommunitySportsRolesModels.js";
import { ordinaryCreatorCommunityFoodRecoveryModels } from "../data/ordinaryCreatorCommunityFoodRecoveryModels.js";
import { ordinaryCreatorCommunityMobilitySupportModels } from "../data/ordinaryCreatorCommunityMobilitySupportModels.js";
import { ordinaryCreatorConsumerEvidenceModels } from "../data/ordinaryCreatorConsumerEvidenceModels.js";
import { ordinaryCreatorDisasterRecoveryModels } from "../data/ordinaryCreatorDisasterRecoveryModels.js";
import { ordinaryCreatorFamilyCareCoordinationModels } from "../data/ordinaryCreatorFamilyCareCoordinationModels.js";
import { ordinaryCreatorTenantEvidenceModels } from "../data/ordinaryCreatorTenantEvidenceModels.js";
import { ordinaryCreatorWorkerEvidenceModels } from "../data/ordinaryCreatorWorkerEvidenceModels.js";
import { ordinaryCreatorHouseholdDigitalMaintenanceModels } from "../data/ordinaryCreatorHouseholdDigitalMaintenanceModels.js";
import { ordinaryCreatorFamilySchoolCoordinationModels } from "../data/ordinaryCreatorFamilySchoolCoordinationModels.js";
import { ordinaryCreatorHouseholdSafetyMaintenanceModels } from "../data/ordinaryCreatorHouseholdSafetyMaintenanceModels.js";
import { ordinaryCreatorHouseholdCircularityModels } from "../data/ordinaryCreatorHouseholdCircularityModels.js";
import { ordinaryCreatorHouseholdFoodSafetyModels } from "../data/ordinaryCreatorHouseholdFoodSafetyModels.js";
import { ordinaryCreatorPersonalRenewalModels } from "../data/ordinaryCreatorPersonalRenewalModels.js";
import { ordinaryCreatorHouseholdPestMonitoringModels } from "../data/ordinaryCreatorHouseholdPestMonitoringModels.js";
import { ordinaryCreatorHouseholdFinancialAccountModels } from "../data/ordinaryCreatorHouseholdFinancialAccountModels.js";
import { ordinaryCreatorIndoorEnvironmentModels } from "../data/ordinaryCreatorIndoorEnvironmentModels.js";
import { ordinaryCreatorHouseholdWaterManagementModels } from "../data/ordinaryCreatorHouseholdWaterManagementModels.js";
import { ordinaryCreatorHouseholdMailManagementModels } from "../data/ordinaryCreatorHouseholdMailManagementModels.js";
import { ordinaryCreatorRemoteServiceWorkModels } from "../data/ordinaryCreatorRemoteServiceWorkModels.js";
import { ordinaryCreatorPublicBenefitNavigationModels } from "../data/ordinaryCreatorPublicBenefitNavigationModels.js";
import { ordinaryCreatorSharedHouseholdCoordinationModels } from "../data/ordinaryCreatorSharedHouseholdCoordinationModels.js";
import { ordinaryCreatorHomeInternetServiceModels } from "../data/ordinaryCreatorHomeInternetServiceModels.js";
import { ordinaryCreatorMobileServiceManagementModels } from "../data/ordinaryCreatorMobileServiceManagementModels.js";
import { ordinaryCreatorEverydayTransportAccountModels } from "../data/ordinaryCreatorEverydayTransportAccountModels.js";
import { ordinaryCreatorVehicleOwnershipModels } from "../data/ordinaryCreatorVehicleOwnershipModels.js";
import { ordinaryCreatorTravelDisruptionModels } from "../data/ordinaryCreatorTravelDisruptionModels.js";
import { ordinaryCreatorEventTicketModels } from "../data/ordinaryCreatorEventTicketModels.js";
import { ordinaryCreatorEducationAdministrationModels } from "../data/ordinaryCreatorEducationAdministrationModels.js";
import { ordinaryCreatorBereavementAdministrationModels } from "../data/ordinaryCreatorBereavementAdministrationModels.js";
import { ordinaryCreatorQuietTimeRitualModels } from "../data/ordinaryCreatorQuietTimeRitualModels.js";
import { ordinaryCreatorAdultFriendshipModels } from "../data/ordinaryCreatorAdultFriendshipModels.js";
import { ordinaryCreatorThirdPlaceModels } from "../data/ordinaryCreatorThirdPlaceModels.js";
import { ordinaryCreatorLocalCultureAudienceModels } from "../data/ordinaryCreatorLocalCultureAudienceModels.js";
import { ordinaryCreatorSportsSpectatorModels } from "../data/ordinaryCreatorSportsSpectatorModels.js";
import { ordinaryCreatorCatalogMeta } from "../data/ordinaryCreatorCatalogMeta.js";
import { ordinaryCreatorModels } from "../data/ordinaryCreatorModels.js";
import { loadOrdinaryCreatorModels } from "../data/loadOrdinaryCreatorModels.js";
import {
  socialBladeUrl,
  viewStatsUrl,
  youtubeCreatorResearch,
} from "./youtubeCreatorService.js";

test("ordinary-person channel ideas distinguish every appearance mode", () => {
  for (const mode of ["on-camera", "faceless", "hybrid"] as const) {
    assert.ok(
      ordinaryCreatorModels.filter((model) => model.mode === mode).length >= 4,
      `${mode} needs at least four executable models`,
    );
  }
});

test("lazy creator catalog preserves the complete aggregate order and references", async () => {
  const lazyModels = await loadOrdinaryCreatorModels();
  assert.deepEqual(lazyModels, ordinaryCreatorModels);
});

test("the latest creator expansion adds exactly thirty directions", () => {
  assert.equal(ordinaryCreatorVerticalModelsBatch30.length, 30);
});

test("the newest creator expansion adds exactly fifty directions", () => {
  assert.equal(ordinaryCreatorVerticalModelsBatch50.length, 50);
});

test("the second fifty-direction expansion is complete", () => {
  assert.equal(ordinaryCreatorVerticalModelsBatch50B.length, 50);
});

test("the ninety-direction expansion is complete", () => {
  assert.equal(ordinaryCreatorVerticalModelsBatch90.length, 90);
});

test("includes Nami's quiet ordinary-life creator model", () => {
  const model = ordinaryCreatorModels.find(
    (candidate) => candidate.id === "quiet-ordinary-life-vlog",
  );
  assert.ok(model);
  assert.equal(model.mode, "faceless");
  assert.ok(model.references.length >= 10);
  assert.ok(
    model.references.some(
      (reference) =>
        reference.name.includes("Nami") &&
        reference.url === "https://www.youtube.com/@naminokurashi",
    ),
  );
});

test("the life-stage expansion adds eight distinct ordinary-person directions", () => {
  assert.equal(ordinaryCreatorLifeStageModels.length, 8);
  assert.equal(
    new Set(ordinaryCreatorLifeStageModels.map((model) => model.category)).size,
    8,
  );
  for (const model of ordinaryCreatorLifeStageModels) {
    assert.ok(model.references.length >= 5);
  }
});

test("the perspective expansion covers six underrepresented life viewpoints", () => {
  assert.equal(ordinaryCreatorPerspectiveModels.length, 6);
  assert.equal(
    new Set(ordinaryCreatorPerspectiveModels.map((model) => model.category)).size,
    6,
  );
  assert.ok(
    ordinaryCreatorPerspectiveModels.some(
      (model) => model.id === "disabled-first-person-daily-life",
    ),
  );
  assert.ok(
    ordinaryCreatorPerspectiveModels.every(
      (model) => model.references.length === 5,
    ),
  );
});

test("curated ordinary-person collections point to valid distinct models", () => {
  const modelIds = new Set(ordinaryCreatorModels.map((model) => model.id));
  assert.ok(ordinaryCreatorCollections.length >= 6);
  for (const collection of ordinaryCreatorCollections) {
    assert.ok(collection.modelIds.length >= 6, `${collection.id} is too narrow`);
    assert.equal(
      new Set(collection.modelIds).size,
      collection.modelIds.length,
      `${collection.id} has duplicate models`,
    );
    assert.ok(
      collection.modelIds.every((id) => modelIds.has(id)),
      `${collection.id} references an unknown model`,
    );
  }
});

test("narrative mechanisms add six repeatable channel engines", () => {
  assert.equal(ordinaryCreatorNarrativeMechanismModels.length, 6);
  assert.ok(
    ordinaryCreatorNarrativeMechanismModels.every(
      (model) => model.repeatableFormat.length === 5,
    ),
  );
  const collection = ordinaryCreatorCollections.find(
    (candidate) => candidate.id === "serial-mechanisms",
  );
  assert.deepEqual(
    new Set(collection?.modelIds),
    new Set(ordinaryCreatorNarrativeMechanismModels.map((model) => model.id)),
  );
});

test("rule-driven expansion adds five evidence-backed progress series", () => {
  assert.equal(ordinaryCreatorRuleDrivenModels.length, 5);
  assert.equal(
    new Set(ordinaryCreatorRuleDrivenModels.map((model) => model.category)).size,
    5,
  );
  for (const model of ordinaryCreatorRuleDrivenModels) {
    assert.ok(model.references.length >= 5, `${model.id} needs five references`);
    assert.ok(
      model.repeatableFormat.length >= 5,
      `${model.id} needs a repeatable progress structure`,
    );
  }
});

test("service-work expansion adds five distinct client or route workflows", () => {
  assert.equal(ordinaryCreatorServiceWorkModels.length, 5);
  assert.equal(
    new Set(ordinaryCreatorServiceWorkModels.map((model) => model.category)).size,
    5,
  );
  assert.ok(
    ordinaryCreatorServiceWorkModels.every(
      (model) => model.references.length >= 3 && model.caution.length >= 50,
    ),
  );
});

test("recovery journeys add five distinct first-person models with strong boundaries", () => {
  assert.equal(ordinaryCreatorRecoveryJourneyModels.length, 5);
  assert.equal(
    new Set(ordinaryCreatorRecoveryJourneyModels.map((model) => model.category)).size,
    5,
  );
  for (const model of ordinaryCreatorRecoveryJourneyModels) {
    assert.ok(model.references.length >= 4, `${model.id} needs four references`);
    assert.ok(model.caution.length >= 60, `${model.id} needs a strong boundary`);
  }
});

test("workplace diaries add five distinct occupations with privacy boundaries", () => {
  assert.equal(ordinaryCreatorWorkplaceDiaryModels.length, 5);
  assert.equal(
    new Set(ordinaryCreatorWorkplaceDiaryModels.map((model) => model.category)).size,
    5,
  );
  for (const model of ordinaryCreatorWorkplaceDiaryModels) {
    assert.ok(model.references.length >= 3, `${model.id} needs three references`);
    assert.match(model.caution, /不|不能|不可|绝不/);
  }
});

test("local utility expansion adds five dated and source-aware channel models", () => {
  assert.equal(ordinaryCreatorLocalUtilityModels.length, 5);
  assert.equal(
    new Set(ordinaryCreatorLocalUtilityModels.map((model) => model.category)).size,
    5,
  );
  for (const model of ordinaryCreatorLocalUtilityModels) {
    assert.ok(model.references.length >= 3, `${model.id} needs three references`);
    assert.match(
      `${model.promise} ${model.repeatableFormat.join(" ")} ${model.caution}`,
      /日期|来源|官方|核对|复测|回访/,
    );
  }
});

test("personal evidence archives add five distinct and auditable channel models", () => {
  assert.equal(ordinaryCreatorEvidenceArchiveModels.length, 5);
  assert.equal(
    new Set(
      ordinaryCreatorEvidenceArchiveModels.map((model) => model.category),
    ).size,
    5,
  );
  for (const model of ordinaryCreatorEvidenceArchiveModels) {
    assert.ok(model.references.length >= 4, `${model.id} needs four references`);
    assert.match(
      `${model.promise} ${model.repeatableFormat.join(" ")} ${model.caution}`,
      /日期|参数|小票|原始|依据|记录|核对|来历/,
    );
  }
});

test("companion-animal expansion adds five distinct welfare-first models", () => {
  assert.equal(ordinaryCreatorCompanionAnimalModels.length, 5);
  assert.equal(
    new Set(ordinaryCreatorCompanionAnimalModels.map((model) => model.category))
      .size,
    5,
  );
  for (const model of ordinaryCreatorCompanionAnimalModels) {
    assert.ok(model.references.length >= 4, `${model.id} needs four references`);
    assert.match(
      `${model.beginnerFit} ${model.repeatableFormat.join(" ")} ${model.caution}`,
      /机构|兽医|专业|培训|授权|正规/,
    );
    assert.match(
      model.caution,
      /不能|不得|禁止|必须|不公开|不擅自/,
    );
  }
});

test("community-organizer expansion adds five consent-led shared projects", () => {
  assert.equal(ordinaryCreatorCommunityOrganizerModels.length, 5);
  assert.equal(
    new Set(ordinaryCreatorCommunityOrganizerModels.map((model) => model.category))
      .size,
    5,
  );
  for (const model of ordinaryCreatorCommunityOrganizerModels) {
    assert.ok(model.references.length >= 4, `${model.id} needs four references`);
    assert.match(
      `${model.minimumKit.join(" ")} ${model.repeatableFormat.join(" ")} ${model.caution}`,
      /授权|许可/,
    );
    assert.match(
      `${model.promise} ${model.repeatableFormat.join(" ")}`,
      /成员|共同|借还|赛季|交换|社群/,
    );
  }
});

test("civic-process expansion adds five source-linked and neutral trackers", () => {
  assert.equal(ordinaryCreatorCivicProcessModels.length, 5);
  assert.equal(
    new Set(ordinaryCreatorCivicProcessModels.map((model) => model.category))
      .size,
    5,
  );
  for (const model of ordinaryCreatorCivicProcessModels) {
    assert.ok(model.references.length >= 4, `${model.id} needs four references`);
    assert.match(
      `${model.minimumKit.join(" ")} ${model.repeatableFormat.join(" ")}`,
      /官方|来源|文件|议程|工单|咨询材料/,
    );
    assert.match(
      model.caution,
      /区分|不得|不能|必须|声明/,
    );
  }
});

test("living-language expansion adds five speaker-led and consent-based models", () => {
  assert.equal(ordinaryCreatorLivingLanguageModels.length, 5);
  assert.equal(
    new Set(ordinaryCreatorLivingLanguageModels.map((model) => model.category))
      .size,
    5,
  );
  for (const model of ordinaryCreatorLivingLanguageModels) {
    assert.ok(model.references.length >= 4, `${model.id} needs four references`);
    assert.match(
      `${model.minimumKit.join(" ")} ${model.repeatableFormat.join(" ")}`,
      /授权|同意|许可/,
    );
    assert.match(
      model.caution,
      /不能|不得|必须|不.*唯一|允许/,
    );
  }
});

test("emergency-readiness expansion adds five official-source and low-risk models", () => {
  assert.equal(ordinaryCreatorEmergencyReadinessModels.length, 5);
  assert.equal(
    new Set(ordinaryCreatorEmergencyReadinessModels.map((model) => model.category)).size,
    5,
  );
  for (const model of ordinaryCreatorEmergencyReadinessModels) {
    assert.ok(model.references.length >= 4, `${model.id} needs four references`);
    assert.match(
      `${model.minimumKit.join(" ")} ${model.repeatableFormat.join(" ")}`,
      /官方|日期|复查|记录|计划/,
    );
    assert.match(
      model.caution,
      /不能替代|不得|不能冒充|必须|应急服务/,
    );
  }
});

test("collaborative-arts expansion adds five consent and rights-aware production diaries", () => {
  assert.equal(ordinaryCreatorCollaborativeArtsModels.length, 5);
  assert.equal(
    new Set(ordinaryCreatorCollaborativeArtsModels.map((model) => model.category)).size,
    5,
  );
  for (const model of ordinaryCreatorCollaborativeArtsModels) {
    assert.ok(model.references.length >= 4, `${model.id} needs four references`);
    assert.match(
      `${model.minimumKit.join(" ")} ${model.repeatableFormat.join(" ")}`,
      /授权|许可|同意|版本|日期/,
    );
    assert.match(model.caution, /必须|不得|需|不等于/);
  }
});

test("neighborhood-support expansion adds five accountable and privacy-aware operations", () => {
  assert.equal(ordinaryCreatorNeighborhoodSupportModels.length, 5);
  assert.equal(
    new Set(ordinaryCreatorNeighborhoodSupportModels.map((model) => model.category)).size,
    5,
  );
  for (const model of ordinaryCreatorNeighborhoodSupportModels) {
    assert.ok(model.references.length >= 4, `${model.id} needs four references`);
    assert.match(
      `${model.minimumKit.join(" ")} ${model.repeatableFormat.join(" ")}`,
      /许可|授权|同意|台账|日期|规则/,
    );
    assert.match(model.caution, /不得|不能|必须|严禁/);
  }
});

test("community-measurement expansion adds five calibrated and uncertainty-aware observations", () => {
  assert.equal(ordinaryCreatorCommunityMeasurementModels.length, 5);
  assert.equal(new Set(ordinaryCreatorCommunityMeasurementModels.map((model) => model.category)).size, 5);
  for (const model of ordinaryCreatorCommunityMeasurementModels) {
    assert.ok(model.references.length >= 4, `${model.id} needs four references`);
    assert.match(`${model.minimumKit.join(" ")} ${model.repeatableFormat.join(" ")}`, /日期|校准|官方|协议|原始/);
    assert.match(model.caution, /不能|不得|不应/);
  }
});

test("local-memory expansion adds five source-rights and consent-aware archives", () => {
  assert.equal(ordinaryCreatorLocalMemoryArchiveModels.length, 5);
  assert.equal(new Set(ordinaryCreatorLocalMemoryArchiveModels.map((model) => model.category)).size, 5);
  for (const model of ordinaryCreatorLocalMemoryArchiveModels) {
    assert.ok(model.references.length >= 4, `${model.id} needs four references`);
    assert.match(`${model.minimumKit.join(" ")} ${model.repeatableFormat.join(" ")}`, /来源|权利|版权|授权|许可|日期/);
    assert.match(model.caution, /不得|不能|必须|不等于/);
  }
});

test("participatory-library expansion adds five permission and privacy-aware public services", () => {
  assert.equal(ordinaryCreatorParticipatoryLibraryModels.length, 5);
  assert.equal(new Set(ordinaryCreatorParticipatoryLibraryModels.map((model) => model.category)).size, 5);
  for (const model of ordinaryCreatorParticipatoryLibraryModels) {
    assert.ok(model.references.length >= 4, `${model.id} needs four references`);
    assert.match(`${model.minimumKit.join(" ")} ${model.repeatableFormat.join(" ")}`, /授权|许可|官方|馆方|日期|台账|版本/);
    assert.match(model.caution, /不得|不能|必须|不等于/);
  }
});

test("participatory-local-media expansion adds five verifiable and correction-ready formats", () => {
  assert.equal(ordinaryCreatorParticipatoryLocalMediaModels.length, 5);
  assert.equal(new Set(ordinaryCreatorParticipatoryLocalMediaModels.map((model) => model.category)).size, 5);
  for (const model of ordinaryCreatorParticipatoryLocalMediaModels) {
    assert.ok(model.references.length >= 4, `${model.id} needs four references`);
    assert.match(`${model.minimumKit.join(" ")} ${model.repeatableFormat.join(" ")}`, /许可|同意|来源|核实|更正|日期|版本/);
    assert.match(model.caution, /不得|不能|必须|不等于/);
  }
});

test("community-biodiversity expansion adds five protocol-led and wildlife-safe monitoring formats", () => {
  assert.equal(ordinaryCreatorCommunityBiodiversityModels.length, 5);
  assert.equal(new Set(ordinaryCreatorCommunityBiodiversityModels.map((model) => model.category)).size, 5);
  for (const model of ordinaryCreatorCommunityBiodiversityModels) {
    assert.ok(model.references.length >= 4, `${model.id} needs four references`);
    assert.match(`${model.minimumKit.join(" ")} ${model.repeatableFormat.join(" ")}`, /协议|官方|日期|版本|努力量|复核/);
    assert.match(model.caution, /不得|不能|必须|不等于/);
  }
});

test("accessible-content expansion adds five user-tested and non-certifying co-design formats", () => {
  assert.equal(ordinaryCreatorAccessibleContentCoDesignModels.length, 5);
  assert.equal(new Set(ordinaryCreatorAccessibleContentCoDesignModels.map((model) => model.category)).size, 5);
  for (const model of ordinaryCreatorAccessibleContentCoDesignModels) {
    assert.ok(model.references.length >= 4, `${model.id} needs four references`);
    assert.match(`${model.minimumKit.join(" ")} ${model.repeatableFormat.join(" ")}`, /同意|复核|测试|许可|版本|日期|报酬/);
    assert.match(model.caution, /不得|不能|必须|不等于/);
  }
});

test("community-sports expansion adds five trained and safeguarding-aware volunteer roles", () => {
  assert.equal(ordinaryCreatorCommunitySportsRolesModels.length, 5);
  assert.equal(new Set(ordinaryCreatorCommunitySportsRolesModels.map((model) => model.category)).size, 5);
  for (const model of ordinaryCreatorCommunitySportsRolesModels) {
    assert.ok(model.references.length >= 4, `${model.id} needs four references`);
    assert.match(`${model.minimumKit.join(" ")} ${model.repeatableFormat.join(" ")}`, /许可|授权|培训|规则|日期|台账|版本/);
    assert.match(model.caution, /不得|不能|必须|不等于/);
  }
});

test("community-food-recovery expansion adds five traceable and food-safe service chains", () => {
  assert.equal(ordinaryCreatorCommunityFoodRecoveryModels.length, 5);
  assert.equal(new Set(ordinaryCreatorCommunityFoodRecoveryModels.map((model) => model.category)).size, 5);
  for (const model of ordinaryCreatorCommunityFoodRecoveryModels) {
    assert.ok(model.references.length >= 4, `${model.id} needs four references`);
    assert.match(`${model.minimumKit.join(" ")} ${model.repeatableFormat.join(" ")}`, /许可|培训|日期|批次|温度|台账|签收/);
    assert.match(model.caution, /不得|不能|必须|不等于/);
  }
});

test("community-mobility expansion adds five authorized and passenger-safe support roles", () => {
  assert.equal(ordinaryCreatorCommunityMobilitySupportModels.length, 5);
  assert.equal(new Set(ordinaryCreatorCommunityMobilitySupportModels.map((model) => model.category)).size, 5);
  for (const model of ordinaryCreatorCommunityMobilitySupportModels) {
    assert.ok(model.references.length >= 4, `${model.id} needs four references`);
    assert.match(`${model.minimumKit.join(" ")} ${model.repeatableFormat.join(" ")}`, /许可|授权|培训|日期|交接|复检|保险|版本/);
    assert.match(model.caution, /不得|不能|必须|不等于/);
  }
});

test("consumer-evidence expansion adds five official-source and privacy-safe case workflows", () => {
  assert.equal(ordinaryCreatorConsumerEvidenceModels.length, 5);
  assert.equal(new Set(ordinaryCreatorConsumerEvidenceModels.map((model) => model.category)).size, 5);
  for (const model of ordinaryCreatorConsumerEvidenceModels) {
    assert.ok(model.references.length >= 4, `${model.id} needs four references`);
    assert.match(`${model.minimumKit.join(" ")} ${model.repeatableFormat.join(" ")}`, /官方|日期|版本|编号|台账|凭证|截图/);
    assert.match(model.caution, /不得|不能|必须|不等于/);
  }
});

test("disaster-recovery expansion adds five official, traceable, and safety-gated workflows", () => {
  assert.equal(ordinaryCreatorDisasterRecoveryModels.length, 5);
  assert.equal(new Set(ordinaryCreatorDisasterRecoveryModels.map((model) => model.category)).size, 5);
  for (const model of ordinaryCreatorDisasterRecoveryModels) {
    assert.ok(model.references.length >= 4, `${model.id} needs four references`);
    assert.match(`${model.minimumKit.join(" ")} ${model.repeatableFormat.join(" ")}`, /官方|日期|许可|编号|台账|版本|交接/);
    assert.match(model.caution, /不得|不能|必须|不等于/);
  }
});

test("family-care expansion adds five consent-led and professionally bounded workflows", () => {
  assert.equal(ordinaryCreatorFamilyCareCoordinationModels.length, 5);
  assert.equal(new Set(ordinaryCreatorFamilyCareCoordinationModels.map((model) => model.category)).size, 5);
  for (const model of ordinaryCreatorFamilyCareCoordinationModels) {
    assert.ok(model.references.length >= 4, `${model.id} needs four references`);
    assert.match(`${model.minimumKit.join(" ")} ${model.repeatableFormat.join(" ")}`, /同意|授权|日期|版本|台账|交接|专业/);
    assert.match(model.caution, /不得|不能|必须|不等于/);
  }
});

test("tenant-evidence expansion adds five dated, privacy-safe, and jurisdiction-aware workflows", () => {
  assert.equal(ordinaryCreatorTenantEvidenceModels.length, 5);
  assert.equal(new Set(ordinaryCreatorTenantEvidenceModels.map((model) => model.category)).size, 5);
  for (const model of ordinaryCreatorTenantEvidenceModels) {
    assert.ok(model.references.length >= 4, `${model.id} needs four references`);
    assert.match(`${model.minimumKit.join(" ")} ${model.repeatableFormat.join(" ")}`, /官方|日期|版本|编号|台账|书面|确认/);
    assert.match(model.caution, /地区|当地/);
    assert.match(model.caution, /不得|不能|必须|不等于/);
  }
});

test("worker-evidence expansion adds five dated, confidential, and official-path workflows", () => {
  assert.equal(ordinaryCreatorWorkerEvidenceModels.length, 5);
  assert.equal(new Set(ordinaryCreatorWorkerEvidenceModels.map((model) => model.category)).size, 5);
  for (const model of ordinaryCreatorWorkerEvidenceModels) {
    assert.ok(model.references.length >= 4, `${model.id} needs four references`);
    assert.match(`${model.minimumKit.join(" ")} ${model.repeatableFormat.join(" ")}`, /日期|版本|编号|台账|书面|确认|官方/);
    assert.match(model.caution, /地区|当地/);
    assert.match(model.caution, /不得|不能|必须|不等于/);
  }
});

test("household-digital expansion adds five recovery-tested and secret-safe workflows", () => {
  assert.equal(ordinaryCreatorHouseholdDigitalMaintenanceModels.length, 5);
  assert.equal(new Set(ordinaryCreatorHouseholdDigitalMaintenanceModels.map((model) => model.category)).size, 5);
  for (const model of ordinaryCreatorHouseholdDigitalMaintenanceModels) {
    assert.ok(model.references.length >= 4, `${model.id} needs four references`);
    assert.match(`${model.minimumKit.join(" ")} ${model.repeatableFormat.join(" ")}`, /日期|版本|台账|恢复|官方|复核|清除/);
    assert.match(model.caution, /密码|恢复码|密钥|账户|设备|数据|影像/);
    assert.match(model.caution, /不得|不能|必须|绝不能/);
  }
});

test("family-school expansion adds five student-private and official-channel workflows", () => {
  assert.equal(ordinaryCreatorFamilySchoolCoordinationModels.length, 5);
  assert.equal(new Set(ordinaryCreatorFamilySchoolCoordinationModels.map((model) => model.category)).size, 5);
  for (const model of ordinaryCreatorFamilySchoolCoordinationModels) {
    assert.ok(model.references.length >= 4, `${model.id} needs four references`);
    assert.match(`${model.minimumKit.join(" ")} ${model.repeatableFormat.join(" ")}`, /日期|版本|台账|回执|书面|官方|确认/);
    assert.match(model.caution, /学生|儿童|孩子/);
    assert.match(model.caution, /不得|不能|必须/);
  }
});

test("household-safety expansion adds five low-risk, official-source maintenance workflows", () => {
  assert.equal(ordinaryCreatorHouseholdSafetyMaintenanceModels.length, 5);
  assert.equal(new Set(ordinaryCreatorHouseholdSafetyMaintenanceModels.map((model) => model.category)).size, 5);
  for (const model of ordinaryCreatorHouseholdSafetyMaintenanceModels) {
    assert.ok(model.references.length >= 4, `${model.id} needs four references`);
    assert.match(`${model.minimumKit.join(" ")} ${model.repeatableFormat.join(" ")}`, /日期|版本|台账|复查|官方|状态|记录/);
    assert.match(model.caution, /不得|不能|必须|绝不能/);
    assert.match(model.caution, /撤离|专业|官方|应急|危险|安全/);
  }
});

test("household-circularity expansion adds five local-rule and traceable handoff workflows", () => {
  assert.equal(ordinaryCreatorHouseholdCircularityModels.length, 5);
  assert.equal(new Set(ordinaryCreatorHouseholdCircularityModels.map((model) => model.category)).size, 5);
  for (const model of ordinaryCreatorHouseholdCircularityModels) {
    assert.ok(model.references.length >= 4, `${model.id} needs four references`);
    assert.match(`${model.minimumKit.join(" ")} ${model.repeatableFormat.join(" ")}`, /日期|版本|台账|交接|当地|凭证|记录/);
    assert.match(model.caution, /不得|不能|必须/);
    assert.match(model.caution, /回收|垃圾|接收|专业|捐赠|电池|化学品/);
  }
});

test("household-food-safety expansion adds five time, temperature, label, and recall workflows", () => {
  assert.equal(ordinaryCreatorHouseholdFoodSafetyModels.length, 5);
  assert.equal(new Set(ordinaryCreatorHouseholdFoodSafetyModels.map((model) => model.category)).size, 5);
  for (const model of ordinaryCreatorHouseholdFoodSafetyModels) {
    assert.ok(model.references.length >= 4, `${model.id} needs four references`);
    assert.match(`${model.minimumKit.join(" ")} ${model.repeatableFormat.join(" ")}`, /日期|时间|温度|版本|台账|标签|批号|记录/);
    assert.match(model.caution, /不得|不能|必须|绝不能/);
    assert.match(model.caution, /安全|食品|医疗|过敏|温度|官方/);
  }
});

test("personal-renewal expansion adds five official, versioned, and privacy-safe workflows", () => {
  assert.equal(ordinaryCreatorPersonalRenewalModels.length, 5);
  assert.equal(new Set(ordinaryCreatorPersonalRenewalModels.map((model) => model.category)).size, 5);
  for (const model of ordinaryCreatorPersonalRenewalModels) {
    assert.ok(model.references.length >= 4, `${model.id} needs four references`);
    assert.match(`${model.minimumKit.join(" ")} ${model.repeatableFormat.join(" ")}`, /到期|版本|日期|状态|台账|凭证|官方/);
    assert.match(model.caution, /不得|不能|必须/);
    assert.match(model.caution, /号码|资料|证件|许可|保单|官方|当地/);
  }
});

test("household-pest expansion adds five monitored, identified, and lower-risk workflows", () => {
  assert.equal(ordinaryCreatorHouseholdPestMonitoringModels.length, 5);
  assert.equal(new Set(ordinaryCreatorHouseholdPestMonitoringModels.map((model) => model.category)).size, 5);
  for (const model of ordinaryCreatorHouseholdPestMonitoringModels) {
    assert.ok(model.references.length >= 4, `${model.id} needs four references`);
    assert.match(`${model.minimumKit.join(" ")} ${model.repeatableFormat.join(" ")}`, /日期|位置|数量|状态|台账|复查|监测/);
    assert.match(model.caution, /不得|不能|必须/);
    assert.match(model.caution, /农药|专业|标签|官方|卫生|污染/);
  }
});

test("household-financial-account expansion adds five official, evidence-led, non-advisory workflows", () => {
  assert.equal(ordinaryCreatorHouseholdFinancialAccountModels.length, 5);
  assert.equal(new Set(ordinaryCreatorHouseholdFinancialAccountModels.map((model) => model.category)).size, 5);
  for (const model of ordinaryCreatorHouseholdFinancialAccountModels) {
    assert.ok(model.references.length >= 4, `${model.id} needs four references`);
    assert.match(`${model.minimumKit.join(" ")} ${model.repeatableFormat.join(" ")}`, /日期|版本|状态|台账|结果|确认|报告/);
    assert.match(model.caution, /不得|不能|必须|绝不能/);
    assert.match(model.caution, /账号|账户|余额|身份|金融|报告|官方/);
  }
});

test("indoor-environment expansion adds five measured, source-led, and professionally bounded workflows", () => {
  assert.equal(ordinaryCreatorIndoorEnvironmentModels.length, 5);
  assert.equal(new Set(ordinaryCreatorIndoorEnvironmentModels.map((model) => model.category)).size, 5);
  for (const model of ordinaryCreatorIndoorEnvironmentModels) {
    assert.ok(model.references.length >= 4, `${model.id} needs four references`);
    assert.match(`${model.minimumKit.join(" ")} ${model.repeatableFormat.join(" ")}`, /日期|位置|条件|结果|台账|复查|版本/);
    assert.match(model.caution, /不得|不能|必须/);
    assert.match(model.caution, /专业|健康|安全|污染|医疗|风险/);
  }
});

test("household-water expansion adds five measured, official, and safely bounded workflows", () => {
  assert.equal(ordinaryCreatorHouseholdWaterManagementModels.length, 5);
  assert.equal(new Set(ordinaryCreatorHouseholdWaterManagementModels.map((model) => model.category)).size, 5);
  for (const model of ordinaryCreatorHouseholdWaterManagementModels) {
    assert.ok(model.references.length >= 4, `${model.id} needs four references`);
    assert.match(`${model.minimumKit.join(" ")} ${model.repeatableFormat.join(" ")}`, /日期|账单|水表|读数|版本|台账|复查|官方/);
    assert.match(model.caution, /不得|不能|必须/);
    assert.match(model.caution, /水表|公用|专业|官方|安全|隐私|限制/);
  }
});

test("household-mail expansion adds five official, private, and outcome-tracked workflows", () => {
  assert.equal(ordinaryCreatorHouseholdMailManagementModels.length, 5);
  assert.equal(new Set(ordinaryCreatorHouseholdMailManagementModels.map((model) => model.category)).size, 5);
  for (const model of ordinaryCreatorHouseholdMailManagementModels) {
    assert.ok(model.references.length >= 4, `${model.id} needs four references`);
    assert.match(`${model.minimumKit.join(" ")} ${model.repeatableFormat.join(" ")}`, /日期|版本|台账|确认|编号|结果|官方/);
    assert.match(model.caution, /不得|不能|必须/);
    assert.match(model.caution, /邮件|邮政|地址|追踪|投递|包裹/);
  }
});

test("remote-service expansion adds five scoped, confidential, and delivery-led workflows", () => {
  assert.equal(ordinaryCreatorRemoteServiceWorkModels.length, 5);
  assert.equal(new Set(ordinaryCreatorRemoteServiceWorkModels.map((model) => model.category)).size, 5);
  for (const model of ordinaryCreatorRemoteServiceWorkModels) {
    assert.ok(model.references.length >= 4, `${model.id} needs four references`);
    assert.match(`${model.minimumKit.join(" ")} ${model.repeatableFormat.join(" ")}`, /工时|版本|台账|交付|确认|结果|授权/);
    assert.match(model.caution, /不得|不能|必须/);
    assert.match(model.caution, /客户|学生|账户|密码|身份|数据|专业/);
  }
});

test("public-benefit expansion adds five official, private, and non-guaranteeing workflows", () => {
  assert.equal(ordinaryCreatorPublicBenefitNavigationModels.length, 5);
  assert.equal(new Set(ordinaryCreatorPublicBenefitNavigationModels.map((model) => model.category)).size, 5);
  for (const model of ordinaryCreatorPublicBenefitNavigationModels) {
    assert.ok(model.references.length >= 4, `${model.id} needs four references`);
    assert.match(`${model.minimumKit.join(" ")} ${model.repeatableFormat.join(" ")}`, /日期|版本|台账|确认|决定|复核|官方/);
    assert.match(model.caution, /不得|不能|必须/);
    assert.match(model.caution, /身份|收入|账户|家庭|地址|案件|医疗/);
  }
});

test("shared-household expansion adds five consent-led, private, and revisable workflows", () => {
  assert.equal(ordinaryCreatorSharedHouseholdCoordinationModels.length, 5);
  assert.equal(new Set(ordinaryCreatorSharedHouseholdCoordinationModels.map((model) => model.category)).size, 5);
  for (const model of ordinaryCreatorSharedHouseholdCoordinationModels) {
    assert.ok(model.references.length >= 4, `${model.id} needs four references`);
    assert.match(`${model.minimumKit.join(" ")} ${model.repeatableFormat.join(" ")}`, /同意|日期|版本|台账|复查|共同|状态/);
    assert.match(model.caution, /不得|不能|必须/);
    assert.match(model.caution, /室友|同住|家庭|他人|个人|隐私|公开/);
  }
});

test("home-internet expansion adds five measured, private, and outcome-tracked workflows", () => {
  assert.equal(ordinaryCreatorHomeInternetServiceModels.length, 5);
  assert.equal(new Set(ordinaryCreatorHomeInternetServiceModels.map((model) => model.category)).size, 5);
  for (const model of ordinaryCreatorHomeInternetServiceModels) {
    assert.ok(model.references.length >= 4, `${model.id} needs four references`);
    assert.match(`${model.minimumKit.join(" ")} ${model.repeatableFormat.join(" ")}`, /日期|版本|台账|结果|编号|条件|状态/);
    assert.match(model.caution, /不得|不能|必须/);
    assert.match(model.caution, /账号|地址|IP|密码|设备|网络|运营商/);
  }
});

test("mobile-service expansion adds five official, secret-safe, and outcome-tracked workflows", () => {
  assert.equal(ordinaryCreatorMobileServiceManagementModels.length, 5);
  assert.equal(new Set(ordinaryCreatorMobileServiceManagementModels.map((model) => model.category)).size, 5);
  for (const model of ordinaryCreatorMobileServiceManagementModels) {
    assert.ok(model.references.length >= 4, `${model.id} needs four references`);
    assert.match(`${model.minimumKit.join(" ")} ${model.repeatableFormat.join(" ")}`, /日期|版本|台账|结果|确认|状态|验证/);
    assert.match(model.caution, /不得|不能|必须/);
    assert.match(model.caution, /号码|账号|SIM|验证码|运营商|设备/);
  }
});

test("everyday-transport expansion adds five lawful, private, and outcome-tracked workflows", () => {
  assert.equal(ordinaryCreatorEverydayTransportAccountModels.length, 5);
  assert.equal(new Set(ordinaryCreatorEverydayTransportAccountModels.map((model) => model.category)).size, 5);
  for (const model of ordinaryCreatorEverydayTransportAccountModels) {
    assert.ok(model.references.length >= 4, `${model.id} needs four references`);
    assert.match(`${model.minimumKit.join(" ")} ${model.repeatableFormat.join(" ")}`, /日期|版本|台账|确认|结果|编号|状态/);
    assert.match(model.caution, /不得|不能|必须/);
    assert.match(model.caution, /账号|卡号|车牌|地址|行程|乘客|费用|许可/);
  }
});

test("vehicle-ownership expansion adds five evidence-led and road-safe workflows", () => {
  assert.equal(ordinaryCreatorVehicleOwnershipModels.length, 5);
  assert.equal(new Set(ordinaryCreatorVehicleOwnershipModels.map((model) => model.category)).size, 5);
  for (const model of ordinaryCreatorVehicleOwnershipModels) {
    assert.ok(model.references.length >= 4, `${model.id} needs four references`);
    assert.match(`${model.minimumKit.join(" ")} ${model.repeatableFormat.join(" ")}`, /日期|版本|台账|结果|授权|状态|查询/);
    assert.match(model.caution, /不得|不能|必须/);
    assert.match(model.caution, /VIN|车牌|车辆|维修|召回|登记|道路/);
  }
});

test("travel-disruption expansion adds five jurisdiction-aware and private workflows", () => {
  assert.equal(ordinaryCreatorTravelDisruptionModels.length, 5);
  assert.equal(new Set(ordinaryCreatorTravelDisruptionModels.map((model) => model.category)).size, 5);
  for (const model of ordinaryCreatorTravelDisruptionModels) {
    assert.ok(model.references.length >= 4, `${model.id} needs four references`);
    assert.match(`${model.minimumKit.join(" ")} ${model.repeatableFormat.join(" ")}`, /日期|版本|台账|结果|编号|规则|状态/);
    assert.match(model.caution, /不得|不能|必须/);
    assert.match(model.caution, /位置|行程|证件|付款|保单|车牌|行李|订位/);
  }
});

test("event-ticket expansion adds five official, code-safe, and accessible workflows", () => {
  assert.equal(ordinaryCreatorEventTicketModels.length, 5);
  assert.equal(new Set(ordinaryCreatorEventTicketModels.map((model) => model.category)).size, 5);
  for (const model of ordinaryCreatorEventTicketModels) {
    assert.ok(model.references.length >= 4, `${model.id} needs four references`);
    assert.match(`${model.minimumKit.join(" ")} ${model.repeatableFormat.join(" ")}`, /日期|版本|台账|结果|确认|规则|状态/);
    assert.match(model.caution, /不得|不能|必须/);
    assert.match(model.caution, /票码|条码|座位|无障碍|安检|付款|账号/);
  }
});

test("education-administration expansion adds five private and non-guaranteeing workflows", () => {
  assert.equal(ordinaryCreatorEducationAdministrationModels.length, 5);
  assert.equal(new Set(ordinaryCreatorEducationAdministrationModels.map((model) => model.category)).size, 5);
  for (const model of ordinaryCreatorEducationAdministrationModels) {
    assert.ok(model.references.length >= 4, `${model.id} needs four references`);
    assert.match(`${model.minimumKit.join(" ")} ${model.repeatableFormat.join(" ")}`, /日期|版本|台账|结果|编号|规则|状态/);
    assert.match(model.caution, /不得|不能|必须/);
    assert.match(model.caution, /学号|成绩|资助|账户|学生|学校|教育/);
  }
});

test("bereavement-administration expansion adds five authorized and dignity-first workflows", () => {
  assert.equal(ordinaryCreatorBereavementAdministrationModels.length, 5);
  assert.equal(new Set(ordinaryCreatorBereavementAdministrationModels.map((model) => model.category)).size, 5);
  for (const model of ordinaryCreatorBereavementAdministrationModels) {
    assert.ok(model.references.length >= 4, `${model.id} needs four references`);
    assert.match(`${model.minimumKit.join(" ")} ${model.repeatableFormat.join(" ")}`, /日期|版本|台账|结果|编号|授权|状态/);
    assert.match(model.caution, /不得|不能|必须/);
    assert.match(model.caution, /逝者|家属|身份|保单|证明|账户|仪式/);
  }
});

test("quiet-time expansion adds five imperfect and repeatable lifestyle series", () => {
  assert.equal(ordinaryCreatorQuietTimeRitualModels.length, 5);
  assert.equal(new Set(ordinaryCreatorQuietTimeRitualModels.map((model) => model.category)).size, 5);
  for (const model of ordinaryCreatorQuietTimeRitualModels) {
    assert.ok(model.references.length >= 5, `${model.id} needs five real creator references`);
    assert.match(`${model.minimumKit.join(" ")} ${model.repeatableFormat.join(" ")}`, /时间|日期|天气|精力|机位|状态|回访/);
    assert.match(model.caution, /不得|不能|必须|不应/);
    assert.match(model.caution, /住址|家庭|家人|作息|位置|通勤/);
    assert.ok(model.references.some((reference) => reference.name === "Nami's life"));
  }
});

test("adult-friendship expansion adds five mutual and revocable social series", () => {
  assert.equal(ordinaryCreatorAdultFriendshipModels.length, 5);
  assert.equal(new Set(ordinaryCreatorAdultFriendshipModels.map((model) => model.category)).size, 5);
  for (const model of ordinaryCreatorAdultFriendshipModels) {
    assert.ok(model.references.length >= 5, `${model.id} needs five creator references`);
    assert.match(`${model.minimumKit.join(" ")} ${model.repeatableFormat.join(" ")}`, /同意|日期|复核|撤回|结果|回访|状态/);
    assert.match(model.caution, /不得|不能|必须/);
    assert.match(model.caution, /朋友|关系|聊天|同意|隐私|旁人/);
  }
});

test("third-place expansion adds five repeated and consent-aware local-life series", () => {
  assert.equal(ordinaryCreatorThirdPlaceModels.length, 5);
  assert.equal(new Set(ordinaryCreatorThirdPlaceModels.map((model) => model.category)).size, 5);
  for (const model of ordinaryCreatorThirdPlaceModels) {
    assert.ok(model.references.length >= 5, `${model.id} needs five creator references`);
    assert.match(`${model.minimumKit.join(" ")} ${model.repeatableFormat.join(" ")}`, /日期|规则|同意|回访|固定|状态|撤回/);
    assert.match(model.caution, /不得|不能|必须/);
    assert.match(model.caution, /读者|同学|常客|摊主|顾客|工作人员|旁人|员工/);
  }
});

test("local-culture audience expansion adds five rights-aware repeat-visit series", () => {
  assert.equal(ordinaryCreatorLocalCultureAudienceModels.length, 5);
  assert.equal(new Set(ordinaryCreatorLocalCultureAudienceModels.map((model) => model.category)).size, 5);
  for (const model of ordinaryCreatorLocalCultureAudienceModels) {
    assert.ok(model.references.length >= 5, `${model.id} needs five creator references`);
    assert.match(`${model.minimumKit.join(" ")} ${model.repeatableFormat.join(" ")}`, /日期|规则|回访|披露|同意|来源|台账/);
    assert.match(model.caution, /不得|不能|必须/);
    assert.match(model.caution, /观众|演出|票码|版权|讲者|表演者|展馆|银幕/);
  }
});

test("sports-spectator expansion adds five safe and evidence-led fan-life series", () => {
  assert.equal(ordinaryCreatorSportsSpectatorModels.length, 5);
  assert.equal(new Set(ordinaryCreatorSportsSpectatorModels.map((model) => model.category)).size, 5);
  for (const model of ordinaryCreatorSportsSpectatorModels) {
    assert.ok(model.references.length >= 5, `${model.id} needs five creator references`);
    assert.match(`${model.minimumKit.join(" ")} ${model.repeatableFormat.join(" ")}`, /日期|规则|回访|结果|台账|披露|来源/);
    assert.match(model.caution, /不得|不能|必须/);
    assert.match(model.caution, /观众|球员|票码|场馆|运动员|球迷|座位|路线/);
  }
});

test("recent discoveries remain visible as one dated collection", () => {
  assert.match(ordinaryCreatorDiscoveryDate, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(
    new Set(recentOrdinaryCreatorDiscoveryIds).size,
    ordinaryCreatorCatalogMeta.discoveryCount,
  );
  const recent = ordinaryCreatorCollections.find(
    (collection) => collection.id === "recent-discoveries",
  );
  assert.deepEqual(recent?.modelIds, [...recentOrdinaryCreatorDiscoveryIds]);
  const modelIds = new Set(ordinaryCreatorModels.map((model) => model.id));
  assert.ok(recentOrdinaryCreatorDiscoveryIds.every((id) => modelIds.has(id)));
});

test("the lightweight creator catalog metadata matches the lazy catalog", () => {
  assert.equal(ordinaryCreatorCatalogMeta.modelCount, ordinaryCreatorModels.length);
  assert.equal(
    ordinaryCreatorCatalogMeta.discoveryCount,
    recentOrdinaryCreatorDiscoveryIds.length,
  );
  assert.equal(
    ordinaryCreatorCatalogMeta.collectionCount,
    ordinaryCreatorCollections.length,
  );
});

test("every ordinary-person channel model is actionable", () => {
  assert.ok(ordinaryCreatorModels.length >= 300);
  for (const model of ordinaryCreatorModels) {
    assert.ok(model.minimumKit.length >= 4, `${model.id} needs a minimum kit`);
    assert.ok(
      model.repeatableFormat.length >= 5,
      `${model.id} needs a repeatable episode structure`,
    );
    assert.ok(
      model.firstTopics.length >= 4,
      `${model.id} needs starter topics`,
    );
    assert.ok(model.incomePaths.length >= 4, `${model.id} needs income paths`);
    assert.ok(
      model.references.length >= 3,
      `${model.id} needs at least three creator examples`,
    );
    const referenceUrls = model.references.map((reference) => reference.url);
    assert.equal(
      new Set(referenceUrls).size,
      referenceUrls.length,
      `${model.id} has duplicate creator examples`,
    );
    assert.ok(
      model.references.every((reference) =>
        reference.url.startsWith("https://www.youtube.com/"),
      ),
    );
  }
});

test("includes the three ambience research categories", () => {
  for (const category of [
    "nature-ambience",
    "ambient-cinema",
    "asmr-nature",
  ] as const) {
    assert.ok(
      youtubeCreatorResearch.creators.filter(
        (creator) => creator.category === category,
      ).length >= 7,
    );
  }
});

test("keeps every creator model represented by a useful research set", () => {
  const categories = [
    "scenic-drive",
    "rain-walk",
    "stationary-nature",
    "urban-walk",
    "guided-walk",
    "cinematic-landscape",
    "nature-ambience",
    "ambient-cinema",
    "asmr-nature",
  ] as const;
  for (const category of categories) {
    assert.ok(
      youtubeCreatorResearch.creators.filter(
        (creator) => creator.category === category,
      ).length >= 5,
      `${category} needs at least five creators`,
    );
  }
});

test("builds a Social Blade handle link from a YouTube channel", () => {
  assert.equal(
    socialBladeUrl("https://www.youtube.com/@AmbientWorlds"),
    "https://socialblade.com/youtube/handle/ambientworlds",
  );
});

test("builds a ViewStats channel analytics link from a YouTube handle", () => {
  assert.equal(
    viewStatsUrl("https://www.youtube.com/@AmbientWorlds/videos"),
    "https://www.viewstats.com/@ambientworlds/channelytics",
  );
});

test("falls back to analytics homepages when a channel has no handle", () => {
  assert.equal(
    socialBladeUrl("https://www.youtube.com/channel/example"),
    "https://socialblade.com/youtube/",
  );
  assert.equal(
    viewStatsUrl("https://www.youtube.com/channel/example"),
    "https://www.viewstats.com/",
  );
});
