"use strict";
// libs/shared-types/src/interfaces/userAvailability.interfaces.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilityValidationRules = exports.getSelectedActivityValues = exports.getBookingStatusValues = exports.getCancellationPolicyValues = exports.getRecurrenceTypeValues = exports.getAvailabilityStatusValues = exports.getDateTypeValues = exports.SelectedActivity = exports.BookingStatus = exports.CancellationPolicy = exports.RecurrenceType = exports.AvailabilityStatus = exports.DateType = void 0;
/**
 * Type of availability date
 */
var DateType;
(function (DateType) {
    DateType["ONLINE"] = "online";
    DateType["OFFLINE"] = "offline";
})(DateType || (exports.DateType = DateType = {}));
/**
 * Status of availability slot
 */
var AvailabilityStatus;
(function (AvailabilityStatus) {
    AvailabilityStatus["ACTIVE"] = "active";
    AvailabilityStatus["CANCELLED"] = "cancelled";
    AvailabilityStatus["COMPLETED"] = "completed";
    AvailabilityStatus["DELETED"] = "deleted";
})(AvailabilityStatus || (exports.AvailabilityStatus = AvailabilityStatus = {}));
/**
 * Type of recurrence pattern
 */
var RecurrenceType;
(function (RecurrenceType) {
    RecurrenceType["NONE"] = "none";
    RecurrenceType["WEEKLY"] = "weekly";
    RecurrenceType["CUSTOM"] = "custom";
})(RecurrenceType || (exports.RecurrenceType = RecurrenceType = {}));
/**
 * Cancellation policy for bookings
 */
var CancellationPolicy;
(function (CancellationPolicy) {
    CancellationPolicy["FLEXIBLE"] = "flexible";
    CancellationPolicy["TWENTY_FOUR_HOURS"] = "24_hours";
    CancellationPolicy["FORTY_EIGHT_HOURS"] = "48_hours";
    CancellationPolicy["STRICT"] = "strict";
})(CancellationPolicy || (exports.CancellationPolicy = CancellationPolicy = {}));
/**
 * Status of booking
 */
var BookingStatus;
(function (BookingStatus) {
    BookingStatus["PENDING"] = "pending";
    BookingStatus["CONFIRMED"] = "confirmed";
    BookingStatus["CANCELLED"] = "cancelled";
    BookingStatus["COMPLETED"] = "completed";
})(BookingStatus || (exports.BookingStatus = BookingStatus = {}));
/**
 * Available activities for dates
 */
var SelectedActivity;
(function (SelectedActivity) {
    SelectedActivity["COFFEE"] = "coffee";
    SelectedActivity["LUNCH"] = "lunch";
    SelectedActivity["DINNER"] = "dinner";
    SelectedActivity["DRINKS"] = "drinks";
    SelectedActivity["MOVIE"] = "movie";
    SelectedActivity["WALK"] = "walk";
    SelectedActivity["ACTIVITY"] = "activity";
    SelectedActivity["CASUAL"] = "casual";
    SelectedActivity["FORMAL"] = "formal";
})(SelectedActivity || (exports.SelectedActivity = SelectedActivity = {}));
// Helper functions to get enum values as arrays
const getDateTypeValues = () => Object.values(DateType);
exports.getDateTypeValues = getDateTypeValues;
const getAvailabilityStatusValues = () => Object.values(AvailabilityStatus);
exports.getAvailabilityStatusValues = getAvailabilityStatusValues;
const getRecurrenceTypeValues = () => Object.values(RecurrenceType);
exports.getRecurrenceTypeValues = getRecurrenceTypeValues;
const getCancellationPolicyValues = () => Object.values(CancellationPolicy);
exports.getCancellationPolicyValues = getCancellationPolicyValues;
const getBookingStatusValues = () => Object.values(BookingStatus);
exports.getBookingStatusValues = getBookingStatusValues;
const getSelectedActivityValues = () => Object.values(SelectedActivity);
exports.getSelectedActivityValues = getSelectedActivityValues;
// ============================================================================
// VALIDATION SCHEMAS (for middleware)
// ============================================================================
/**
 * Validation constraints for availability data
 */
exports.AvailabilityValidationRules = {
    timeSlot: {
        minDurationMinutes: 30,
        maxDurationMinutes: 480, // 8 hours
        maxFutureDays: 90,
        minAdvanceHours: 2
    },
    booking: {
        minCancellationHours: {
            flexible: 1,
            '24_hours': 24,
            '48_hours': 48,
            strict: 72
        },
        maxBookingsPerDay: 5,
        maxBookingsPerWeek: 20
    },
    recurrence: {
        maxRecurrenceWeeks: 26, // 6 months
        maxSlotsPerRecurrence: 50
    }
};
