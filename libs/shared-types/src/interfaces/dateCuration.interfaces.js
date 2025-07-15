"use strict";
// libs/shared-types/src/interfaces/dateCuration.interfaces.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateCurationValidationRules = exports.getWorkflowStageStatusValues = exports.getCurationWorkflowStageValues = exports.getCancellationCategoryValues = exports.getRelationshipStageValues = exports.getCuratedDateStatusValues = exports.getDateModeValues = exports.WorkflowStageStatus = exports.CurationWorkflowStage = exports.CancellationCategory = exports.RelationshipStage = exports.CuratedDateStatus = exports.DateMode = void 0;
/**
 * Date mode types
 */
var DateMode;
(function (DateMode) {
    DateMode["ONLINE"] = "online";
    DateMode["OFFLINE"] = "offline";
})(DateMode || (exports.DateMode = DateMode = {}));
/**
 * Curated date status types
 */
var CuratedDateStatus;
(function (CuratedDateStatus) {
    CuratedDateStatus["PENDING"] = "pending";
    CuratedDateStatus["USER1_CONFIRMED"] = "user1_confirmed";
    CuratedDateStatus["USER2_CONFIRMED"] = "user2_confirmed";
    CuratedDateStatus["BOTH_CONFIRMED"] = "both_confirmed";
    CuratedDateStatus["CANCELLED"] = "cancelled";
    CuratedDateStatus["COMPLETED"] = "completed";
    CuratedDateStatus["NO_SHOW"] = "no_show";
})(CuratedDateStatus || (exports.CuratedDateStatus = CuratedDateStatus = {}));
/**
 * Date series relationship stages
 */
var RelationshipStage;
(function (RelationshipStage) {
    RelationshipStage["GETTING_TO_KNOW"] = "getting_to_know";
    RelationshipStage["BUILDING_CONNECTION"] = "building_connection";
    RelationshipStage["STRONG_INTEREST"] = "strong_interest";
    RelationshipStage["EXCLUSIVE_DATING"] = "exclusive_dating";
    RelationshipStage["RELATIONSHIP"] = "relationship";
})(RelationshipStage || (exports.RelationshipStage = RelationshipStage = {}));
/**
 * Cancellation categories
 */
var CancellationCategory;
(function (CancellationCategory) {
    CancellationCategory["NO_TIME"] = "no_time";
    CancellationCategory["NOT_INTERESTED"] = "not_interested";
    CancellationCategory["EMERGENCY"] = "emergency";
    CancellationCategory["OTHER"] = "other";
})(CancellationCategory || (exports.CancellationCategory = CancellationCategory = {}));
/**
 * Workflow stages for admin curation
 */
var CurationWorkflowStage;
(function (CurationWorkflowStage) {
    CurationWorkflowStage["USER_SELECTION"] = "user_selection";
    CurationWorkflowStage["COMPATIBILITY_CHECK"] = "compatibility_check";
    CurationWorkflowStage["SCHEDULING"] = "scheduling";
    CurationWorkflowStage["CONFIRMATION"] = "confirmation";
    CurationWorkflowStage["REMINDER_SENT"] = "reminder_sent";
    CurationWorkflowStage["COMPLETED"] = "completed";
    CurationWorkflowStage["FEEDBACK_COLLECTED"] = "feedback_collected";
})(CurationWorkflowStage || (exports.CurationWorkflowStage = CurationWorkflowStage = {}));
/**
 * Stage status for workflow tracking
 */
var WorkflowStageStatus;
(function (WorkflowStageStatus) {
    WorkflowStageStatus["PENDING"] = "pending";
    WorkflowStageStatus["IN_PROGRESS"] = "in_progress";
    WorkflowStageStatus["COMPLETED"] = "completed";
    WorkflowStageStatus["FAILED"] = "failed";
})(WorkflowStageStatus || (exports.WorkflowStageStatus = WorkflowStageStatus = {}));
// Helper functions to get enum values as arrays
const getDateModeValues = () => Object.values(DateMode);
exports.getDateModeValues = getDateModeValues;
const getCuratedDateStatusValues = () => Object.values(CuratedDateStatus);
exports.getCuratedDateStatusValues = getCuratedDateStatusValues;
const getRelationshipStageValues = () => Object.values(RelationshipStage);
exports.getRelationshipStageValues = getRelationshipStageValues;
const getCancellationCategoryValues = () => Object.values(CancellationCategory);
exports.getCancellationCategoryValues = getCancellationCategoryValues;
const getCurationWorkflowStageValues = () => Object.values(CurationWorkflowStage);
exports.getCurationWorkflowStageValues = getCurationWorkflowStageValues;
const getWorkflowStageStatusValues = () => Object.values(WorkflowStageStatus);
exports.getWorkflowStageStatusValues = getWorkflowStageStatusValues;
// ============================================================================
// VALIDATION SCHEMAS (for middleware)
// ============================================================================
/**
 * Validation constraints for date curation
 */
exports.DateCurationValidationRules = {
    dateScheduling: {
        minAdvanceHours: 24, // minimum 24 hours in advance
        maxAdvanceDays: 90, // maximum 90 days in advance
        minDurationMinutes: 30,
        maxDurationMinutes: 240, // 4 hours max
        allowedTimeSlots: {
            start: '09:00',
            end: '22:00'
        }
    },
    feedback: {
        submissionDeadlineHours: 48, // 48 hours after date completion
        minRating: 1,
        maxRating: 5,
        maxRedFlags: 5,
        maxCommentLength: 1000
    },
    trustScore: {
        warningThresholds: {
            level1: 70, // below 70 gets warning level 1
            level2: 50, // below 50 gets warning level 2  
            level3: 30 // below 30 gets warning level 3
        },
        probationThreshold: 40,
        probationDurationDays: 30,
        maxConsecutiveCancellations: 3
    },
    cancellation: {
        freeThresholdHours: 24, // can cancel free if >24h before date
        partialRefundThresholdHours: 4, // partial refund if 4-24h before
        noRefundThresholdHours: 4 // no refund if <4h before
    }
};
