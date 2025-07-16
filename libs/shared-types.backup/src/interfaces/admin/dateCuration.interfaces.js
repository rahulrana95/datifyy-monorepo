"use strict";
/**
 * Date Curation Interfaces
 * Complete interfaces for admin-managed date curation system
 *
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateCurationValidationRules = exports.getWorkflowStageStatusValues = exports.getCurationWorkflowStageValues = exports.getCancellationCategoryValues = exports.getRelationshipStageValues = exports.getCuratedDateStatusValues = exports.getDateModeValues = exports.WorkflowStageStatus = exports.CurationWorkflowStage = exports.RelationshipStage = exports.CancellationCategory = exports.DateMode = void 0;
const dateCuration_interfaces_1 = require("../dateCuration.interfaces");
// =============================================================================
// CORE DATE CURATION ENUMS
// =============================================================================
/**
 * Date mode options
 */
var DateMode;
(function (DateMode) {
    DateMode["ONLINE"] = "online";
    DateMode["OFFLINE"] = "offline";
})(DateMode || (exports.DateMode = DateMode = {}));
/**
 * Cancellation categories for analytics
 */
var CancellationCategory;
(function (CancellationCategory) {
    CancellationCategory["EMERGENCY"] = "emergency";
    CancellationCategory["ILLNESS"] = "illness";
    CancellationCategory["WORK_CONFLICT"] = "work_conflict";
    CancellationCategory["PERSONAL_REASON"] = "personal_reason";
    CancellationCategory["NOT_INTERESTED"] = "not_interested";
    CancellationCategory["SCHEDULING_ERROR"] = "scheduling_error";
    CancellationCategory["OTHER"] = "other";
})(CancellationCategory || (exports.CancellationCategory = CancellationCategory = {}));
/**
 * Relationship stage tracking
 */
var RelationshipStage;
(function (RelationshipStage) {
    RelationshipStage["GETTING_TO_KNOW"] = "getting_to_know";
    RelationshipStage["BUILDING_CONNECTION"] = "building_connection";
    RelationshipStage["SERIOUS_INTEREST"] = "serious_interest";
    RelationshipStage["EXCLUSIVE"] = "exclusive";
    RelationshipStage["ENDED"] = "ended";
})(RelationshipStage || (exports.RelationshipStage = RelationshipStage = {}));
/**
 * Curation workflow stages
 */
var CurationWorkflowStage;
(function (CurationWorkflowStage) {
    CurationWorkflowStage["INITIAL_MATCH"] = "initial_match";
    CurationWorkflowStage["COMPATIBILITY_CHECK"] = "compatibility_check";
    CurationWorkflowStage["SCHEDULING"] = "scheduling";
    CurationWorkflowStage["CONFIRMATION"] = "confirmation";
    CurationWorkflowStage["REMINDER_SENT"] = "reminder_sent";
    CurationWorkflowStage["COMPLETED"] = "completed";
    CurationWorkflowStage["FOLLOW_UP"] = "follow_up";
})(CurationWorkflowStage || (exports.CurationWorkflowStage = CurationWorkflowStage = {}));
/**
 * Workflow stage status
 */
var WorkflowStageStatus;
(function (WorkflowStageStatus) {
    WorkflowStageStatus["PENDING"] = "pending";
    WorkflowStageStatus["IN_PROGRESS"] = "in_progress";
    WorkflowStageStatus["COMPLETED"] = "completed";
    WorkflowStageStatus["FAILED"] = "failed";
    WorkflowStageStatus["SKIPPED"] = "skipped";
})(WorkflowStageStatus || (exports.WorkflowStageStatus = WorkflowStageStatus = {}));
// =============================================================================
// HELPER FUNCTIONS
// =============================================================================
/**
 * Get date mode values as array
 */
const getDateModeValues = () => Object.values(DateMode);
exports.getDateModeValues = getDateModeValues;
/**
 * Get curated date status values as array
 */
const getCuratedDateStatusValues = () => Object.values(dateCuration_interfaces_1.CuratedDateStatus);
exports.getCuratedDateStatusValues = getCuratedDateStatusValues;
/**
 * Get relationship stage values as array
 */
const getRelationshipStageValues = () => Object.values(RelationshipStage);
exports.getRelationshipStageValues = getRelationshipStageValues;
/**
 * Get cancellation category values as array
 */
const getCancellationCategoryValues = () => Object.values(CancellationCategory);
exports.getCancellationCategoryValues = getCancellationCategoryValues;
/**
 * Get curation workflow stage values as array
 */
const getCurationWorkflowStageValues = () => Object.values(CurationWorkflowStage);
exports.getCurationWorkflowStageValues = getCurationWorkflowStageValues;
/**
 * Get workflow stage status values as array
 */
const getWorkflowStageStatusValues = () => Object.values(WorkflowStageStatus);
exports.getWorkflowStageStatusValues = getWorkflowStageStatusValues;
// =============================================================================
// VALIDATION RULES
// =============================================================================
/**
 * Validation rules for date curation
 */
exports.DateCurationValidationRules = {
    MAX_FUTURE_DAYS: 30, // Can't schedule more than 30 days in advance
    MIN_FUTURE_HOURS: 2, // Must be at least 2 hours in the future
    MAX_DURATION_MINUTES: 180, // Max 3 hours
    MIN_DURATION_MINUTES: 30, // Min 30 minutes
    MAX_ADMIN_NOTES_LENGTH: 1000,
    MAX_FEEDBACK_LENGTH: 2000,
    MAX_CONVERSATION_TOPICS: 5,
    MIN_COMPATIBILITY_SCORE: 30, // Minimum to suggest a match
    MAX_DATES_PER_USER_PER_WEEK: 3,
    CANCELLATION_GRACE_PERIOD_HOURS: 24, // Free cancellation window
};
