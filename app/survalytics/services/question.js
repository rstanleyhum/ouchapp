'use strict';

import { GetQuestion } from './localdb'

/**
 * 
 * This structure holds the current question. The list of questions is always kept in the SQLITE db. This structure drives the display
 * of the question/answer. It may also drive some of the response loading.
 * 
 * Unlike the C# version of Survalytics, the Javascript version stores each question in
 * JSON objects because it is a natural fit.
 * 
 * The object structure is:
 * 
 * {
 *      "questionguid" : STRING,
 *      "json_str"     : 
 *          {
 *              "surveyname_str"        : STRING,
 *              "surveyguid_str"        : STRING,
 *              "ordinalposition_int"   : INT,
 *              "questionguid_str"	    : STRING,
 *              "questionprompt_str"	: STRING,
 *              "questiontype_str"	    : STRING,
 *              "responses_arr"		    : 
 *                  [
 *                      {
 *                          "responseid_int" : INTEGER,
 *                          "response_str"	 : STRING,
 *                      },...
 *                  ],
 *        	    "conditional_upon_questionguid_str"	: STRING,
 *              "conditional_upon_responseid_arr'	:
 *                  [
 *                      {
 *                          "conditional_upon_responseid_int" : INTEGER
 *                      },...
 *                  ],
 *              "conditionalbycountry_str"      : STRING,
 *              "conditional_upon_datemsid_int"	: INTEGER,
 *              "delaybydays_int"   			: INTEGER,
 *              "ongoingquestion_arr"			: 
 *                  [
 *                      {
 *                          "notificationtime_str" 	: STRING,
 *                      },...
 *          		],
 *              "deletequestion_str"			: STRING,
 *          },
 *      "ordinalposition_int"  : INTEGER,
 *      "final_responseid_int" : INTEGER,
 *      "final_response_str"   : STRING,
 *      "answered_bool"        : INTEGER,
 *
 *   Calculated variables ***
 * 
 *      "inferred" :
 *          {
 *              "button_values" :
 *                  [
 *                      {
 *                          "button_response_text" : STRING,
 *                          "button_response_id"   : INTEGER,
 *                          "button_selected"      : BOOLEAN
 *                      }, ...
 *                  ],
 *              "text_values" :
 *                  {
 *                      "text_response_text" : STRING,
 *                      "text_answer_text"   : STRING
 *                  },
 *              "slider_values" :
 *                  {
 *                      "slider_min"   : INTEGER,
 *                      "slider_max"   : INTEGER,
 *                      "slider_value" : INTEGER
 *                  },
 *              "checkbox_values" :
 *                  [
 *                      {
 *                          "checkbox_answer_response_text" : STRING,
 *                          "checkbox_answer_response_id"   : INTEGER,
 *                          "checkbox_answer_checked"       : BOOLEAN
 *                      }, ...
 *                  ]
 *          }
 * }
 * 
 * - all of the functions are either getters and setters or conditionals
 * - very few actually do much complex changes
 * 
 */


export const TYPE_BUTTONS = 'buttons';
export const TYPE_TEXT = 'text';
export const TYPE_CHECKBOXES = 'checkboxes';
export const TYPE_SLIDER = 'slider';


export const NewQuestion = (questionguid_str, json_str, ordinalposition_int, final_responseid_int = 0, final_response_str = '', ongoingquestion_int = null, answered_bool = 0, uploaded_int = 0) => {
    var p = new Promise( (resolve, reject) => {
        var result = {};
        result.questionguid_str = questionguid_str;
        if (typeof json_str == "string") {
            result.json_str = JSON.parse(json_str) || {};
        } else {
            result.json_str = JSON.parse(JSON.stringify(json_str)) || {};
        }
        result.ordinalposition_int = ordinalposition_int;
        result.final_responseid_int = final_responseid_int;
        result.final_response_str = final_response_str;
        result.answered_bool = answered_bool;
        if (typeof result.json_str.deletequestion_str != "undefined") {
            resolve(result);
        }

        if (ongoingquestion_int != null) {
            result.ongoingquestion_int = ongoingquestion_int;
        } else {
            result.ongoingquestion_int = (typeof result.json_str.ongoingquestion_arr != 'undefined') ? 1 : 0;
            result.answered_bool = (typeof result.json_str.ongoingquestion_arr != 'undefined') ? 1 : 0;
        }

        if (typeof result.json_str.delaybydays_int != 'undefined') {
            result.json_str.conditional_upon_datemsid_int = Date.now() + (result.json_str.delaybydays_int * 24 * 60 * 60 * 1000);
            delete result.json_str.delaybydays_int;
        }

        result.uploaded_int = uploaded_int;

        result.inferred = _calculatedInferred(result.json_str);
        
        resolve(result)
    });
    return p;
};


export const CloneQuestion = (q) => {
    return JSON.parse(JSON.stringify(q));
};


const _calculatedInferred = (json_str) => {
    var button_values = [];
    var text_values = {
        text_response_text: "",
        text_answer_text: ""
    };
    var slider_values = {
        slider_min: 0,
        slider_max: 0,
        slider_value: 0
    };
    var checkbox_values = [];

    if (json_str.questiontype_str == TYPE_BUTTONS) {
        button_values = _getButtonResponseStructure(json_str);
    }

    if (json_str.questiontype_str == TYPE_TEXT) {
        text_values = _getTextResponseStructure(json_str);
    }

    if (json_str.questiontype_str == TYPE_SLIDER) {
        slider_values = _getSliderResponseStructure(json_str);
    }

    if (json_str.questiontype_str == TYPE_CHECKBOXES) {
        checkbox_values = _getCheckboxResponseStructure(json_str);
    }

    return {
        button_values: button_values,
        text_values: text_values,
        slider_values: slider_values,
        checkbox_values: checkbox_values
    }
};


const _getButtonResponseStructure = (json_str) => {
    if (typeof json_str.responses_arr == 'undefined') {
        return [];
    }

    return json_str.responses_arr.map( (item) => {
        return {
            button_response_text: item.response_str,
            button_response_id:   item.responseid_int,
            button_selected: false
        }
    });
};


const _getTextResponseStructure = (json_str) => {
    var result = {
        text_response_text: "",
        text_answer_text: "",
    };

    if (typeof json_str.responses_arr == 'undefined') {
        return result;
    }

    if (typeof json_str.responses_arr[0] == 'undefined') {
        return result;
    }

    result.text_response_text = json_str.responses_arr[0].response
    return result;
};


const _getSliderResponseStructure = (json_str) => {
    var result = {
        slider_min: 0,
        slider_max: 0,
        slider_value: 0
    };
    
    if (typeof json_str.responses_arr == 'undefined') {
        return result;
    }

    if (typeof json_str.responses_arr[0] != 'undefined') {
        result.slider_min = parseInt(json_str.responses_arr[0].response_str) || 0
    }

    if (typeof json_str.responses_arr[1] != 'undefined') {
        result.slider_max = parseInt(json_str.responses_arr[1].response_str) || 0
    }

    return result;
};


const _getCheckboxResponseStructure = (json_str) => {
    var result = [];

    if (typeof json_str.responses_arr == 'undefined') {
        return result;
    }

    return json_str.responses_arr.map( (item) => {
        return {
            checkbox_answer_response_text: item.response_str,
            checkbox_answer_response_id: item.responseid_int,
            checkbox_answer_checked: false
        }
    })
};


export const IsConditional = (q) => {
    var p = new Promise( (resolve, reject) => {
        var conditional_guid = q.json_str.conditional_upon_questionguid_str;
        if (typeof conditional_guid == "undefined") {
            resolve(false);
        }
        resolve(true);
    });
    return p;
};


export const IsRelevantConditionalQuestion = (q) => {
    var p = new Promise( (resolve, reject) => {
        if (q.ongoingquestion_int || q.answered_bool) {
            resolve(false);
        }

        var conditional_time = q.json_str.conditional_upon_datemsid_int
        let current_time = Date.now();

        if ((typeof conditional_time != 'undefined') && (current_time < conditional_time)) {
            resolve(false);
        }

        var conditional_guid = q.json_str.conditional_upon_questionguid_str;
        
        if (typeof conditional_guid == 'undefined') {
            resolve(true);
        } else {

            GetQuestion(conditional_guid)
                .then( (original) => {
                    if ((original == null) || (!original.answered_bool)) {
                        resolve(false);
                    }

                    var conditional_response_array = this.json_str.conditional_upon_responseid_arr;

                    return this._compareConditionalResponses(conditional_guid, original.questiontype_str, conditional_response_array, original.final_response_str);
                })
                .then( (result) => {
                    resolve(result);
                })
                .catch( (error) => {
                    reject(error);
                });

        }
    });
    return p;
};


const _compareConditionalResponses = (cond_guid, questiontype, conditional, original) => {
    if (questiontype == TYPE_CHECKBOXES) {
        return _compareConditionalCheckboxesResponses(cond_guid, conditional, original);
    } else if (questiontype == TYPE_SLIDER) {
        return _compareConditionalSliderResponses(conditional, original);
    } else if (questiontype == TYPE_BUTTONS) {
        return _compareConditionalButtonsResponses(conditional, original);
    }
    return false;
};


const _compareConditionalCheckboxesResponses = (cond_guid, cond, orig) => {
    var orig_answers = JSON.parse(orig);
    var num_orig_answers = orig_answers.length;

    for (var i = 0; i < num_orig_answers; i++ ) {

        var original_answer_str = orig_answers[i].XXXXX;
        var num_cond_responses = cond.length;

        for (var j = 0; j < num_cond_responses; j++) {

            var cond_answer_str = cond_guid + "-" + cond[j].conditional_upon_responseid_int.toString();

            if (cond_answer_str == original_answer_str) {
                return true;
            }
        }

    }
    return false;
};


const _compareConditionalSliderResponses = (cond, orig) => {
   var num_cond_responses = cond.length;

    if (num_cond_responses < 2) {
        return false;
    }

    var lowerbound = cond[0].conditional_upon_responseid_int;
    var upperbound = cond[1].conditional_upon_responseid_int;

    if (!(lowerbound || upperbound)) {
        return false;
    }

    var orig_value = parseFloat(orig);

    if ((orig_value >= lowerbound) && (orig_value <= upperbound)) {
        return true;
    }

    return false;
};


const _compareConditionalButtonsResponses = (cond, orig) => {
    var orig_value = parseInt(orig);

    var num_cond_responses = cond.length;

    for (var i = 0; i < num_cond_responses; i++) {
        if (orig_value == cond[i].conditional_upon_responseid_int) {
            return true;
        }
    }

    return false;
};


export const DeleteQuestionGUID = (q) => {
    var p = new Promise( (resolve, reject) => {
        resolve(q.json_str.deletequestion_str || null);
    });
    return p;
};


export const UpdateQuestionWithResponse = (q) => {
    var result = JSON.parse(JSON.stringify(q));
    var responses = _createQuestionTypeResponse(q);

    if ((responses.final_response_str == "") && (responses.final_responseid_int == 0)) {
        return null;
    }
    result.answered_bool = 1;
    result.final_response_str = responses.final_response_str;
    result.final_responseid_int = responses.final_responseid_int;

    return result;
};


const _createQuestionTypeResponse = (q) => {
    var response_str = "";
    var response_id = 0;

    if (q.json_str.questiontype_str == TYPE_BUTTONS) {
        var num_buttons = q.inferred.button_values.length;
        for (var i = 0; i < num_buttons; i++) {
            if (q.inferred.button_values[i].button_selected) {
                response_str = q.inferred.button_values[i].button_response_text;
                response_id = q.inferred.button_values[i].button_response_id;
                break;
            }
        }
    }

    if (q.json_str.questiontype_str == TYPE_TEXT) {
        response_str = q.inferred.text_values.text_answer_text;
        response_id = -499;
    }

    if (q.json_str.questiontype_str == TYPE_SLIDER) {
        response_str = q.inferred.slider_values.slider_value;
        response_id = -498;
    }
    
    if (q.json_str.questiontype_str == TYPE_CHECKBOXES) {
        var results = [];
        var num_checkboxes = q.inferred.checkbox_values.length;
        for (var i = 0; i < num_checkboxes; i++) {
            var checkbox = q.inferred.checkbox_values[i];
            if (checkbox.checkbox_answer_checked) {
                var item = {};
                item.response_str = checkbox.checkbox_answer_response_id.toString();
                item.responseid_str = q.questionguid_str + "-" + checkbox.checkbox_answer_response_id.toString();
                results.push(item);
            }
        }
        response_str = JSON.stringify(results);
        response_id = -497;
    }

    var responses = {};
    responses.final_response_str = response_str;
    responses.final_responseid_int = response_id;

    return responses;
};




