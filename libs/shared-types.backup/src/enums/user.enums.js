"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pronoun = exports.StarSign = exports.LookingFor = exports.SmokingHabit = exports.DrinkingHabit = exports.EducationLevel = exports.ExerciseLevelLabels = exports.ExerciseLevel = exports.GenderOptions = exports.GenderLabels = exports.Gender = void 0;
/**
 * Gender enum - Single source of truth
 * Database stores lowercase, frontend displays capitalized
 */
var Gender;
(function (Gender) {
    Gender["MALE"] = "male";
    Gender["FEMALE"] = "female";
    Gender["OTHER"] = "other";
})(Gender || (exports.Gender = Gender = {}));
exports.GenderLabels = {
    [Gender.MALE]: 'Male',
    [Gender.FEMALE]: 'Female',
    [Gender.OTHER]: 'Other'
};
exports.GenderOptions = Object.entries(exports.GenderLabels).map(([value, label]) => ({
    value: value,
    label
}));
/**
 * Exercise levels
 */
var ExerciseLevel;
(function (ExerciseLevel) {
    ExerciseLevel["NONE"] = "None";
    ExerciseLevel["LIGHT"] = "Light";
    ExerciseLevel["MODERATE"] = "Moderate";
    ExerciseLevel["HEAVY"] = "Heavy";
})(ExerciseLevel || (exports.ExerciseLevel = ExerciseLevel = {}));
exports.ExerciseLevelLabels = {
    [ExerciseLevel.NONE]: 'No Exercise',
    [ExerciseLevel.LIGHT]: 'Light Exercise',
    [ExerciseLevel.MODERATE]: 'Moderate Exercise',
    [ExerciseLevel.HEAVY]: 'Heavy Exercise'
};
/**
 * Education levels
 */
var EducationLevel;
(function (EducationLevel) {
    EducationLevel["HIGH_SCHOOL"] = "High School";
    EducationLevel["UNDERGRADUATE"] = "Undergraduate";
    EducationLevel["GRADUATE"] = "Graduate";
    EducationLevel["POSTGRADUATE"] = "Postgraduate";
})(EducationLevel || (exports.EducationLevel = EducationLevel = {}));
/**
 * Drinking habits
 */
var DrinkingHabit;
(function (DrinkingHabit) {
    DrinkingHabit["NEVER"] = "Never";
    DrinkingHabit["OCCASIONALLY"] = "Occasionally";
    DrinkingHabit["REGULARLY"] = "Regularly";
})(DrinkingHabit || (exports.DrinkingHabit = DrinkingHabit = {}));
/**
 * Smoking habits
 */
var SmokingHabit;
(function (SmokingHabit) {
    SmokingHabit["NEVER"] = "Never";
    SmokingHabit["OCCASIONALLY"] = "Occasionally";
    SmokingHabit["REGULARLY"] = "Regularly";
})(SmokingHabit || (exports.SmokingHabit = SmokingHabit = {}));
/**
 * Looking for options
 */
var LookingFor;
(function (LookingFor) {
    LookingFor["FRIENDSHIP"] = "Friendship";
    LookingFor["CASUAL"] = "Casual";
    LookingFor["RELATIONSHIP"] = "Relationship";
})(LookingFor || (exports.LookingFor = LookingFor = {}));
/**
 * Star signs
 */
var StarSign;
(function (StarSign) {
    StarSign["ARIES"] = "Aries";
    StarSign["TAURUS"] = "Taurus";
    StarSign["GEMINI"] = "Gemini";
    StarSign["CANCER"] = "Cancer";
    StarSign["LEO"] = "Leo";
    StarSign["VIRGO"] = "Virgo";
    StarSign["LIBRA"] = "Libra";
    StarSign["SCORPIO"] = "Scorpio";
    StarSign["SAGITTARIUS"] = "Sagittarius";
    StarSign["CAPRICORN"] = "Capricorn";
    StarSign["AQUARIUS"] = "Aquarius";
    StarSign["PISCES"] = "Pisces";
})(StarSign || (exports.StarSign = StarSign = {}));
/**
 * Pronouns
 */
var Pronoun;
(function (Pronoun) {
    Pronoun["HE_HIM"] = "He/Him";
    Pronoun["SHE_HER"] = "She/Her";
    Pronoun["THEY_THEM"] = "They/Them";
    Pronoun["OTHER"] = "Other";
})(Pronoun || (exports.Pronoun = Pronoun = {}));
