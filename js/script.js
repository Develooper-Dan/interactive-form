/********************************************
General
********************************************/
/* (Re-)Sets the document to the basic starting layout like it should appear to anyone who visits the site for
the first time. Input values are erased, boxes are unchecked and only the proper fields are shown. Execution at the very bottom of this script.
*/
function setPage() {
  $("#name").focus();
  $("#other-title").hide();
  $("#title option").first().prop("selected", true);
  $("input").val("");
  $("#design option").first().prop("selected", true);
  $("#colors-js-puns").hide();
  $(":checked").each((i, e) => {
    $(e).prop("checked", false);
  });
  $ (".activities").append('<p class="total">Total: <span>$0</span></p>');
    displayPaymentOptions("firstLoad");
}

/********************************************
Section Basic info
********************************************/
// shows/hides the "other" input field if appropriate
$("#title").change((e) => {
  if ($(e.target).val() === "other"){
    $("#other-title").show();
  } else {
    $("#other-title").hide();
  }
});

/********************************************
Section T-Shirt info
********************************************/
// shows/hides T-Shirt colors based on the chosen shirt design. Needs a regex-argument and tests it with the options text.
function showSelectedDesign(regEx){
  let foundItems =[];
  $("#color option").each((i, shirt) => {
    if (regEx.test($(shirt).text())){
      $(shirt).show();
      foundItems.push($(shirt));
    } else { $(shirt).hide().prop("selected", false);
  }
  });
  foundItems[0].prop("selected", true);
}

// If the user chooses a design, the "Select Theme" option is hidden and the color menu with the matching colors is shown.
$("#design").change((e) => {
  $("#design option").first().hide().prop("selected", false);
  $("#colors-js-puns").show();
  if ($(e.target).val() === "js puns"){
    showSelectedDesign(/(?:puns)/i);
  } else {
    showSelectedDesign(/(?:js shirt)/i);
    }
  });

/********************************************
Section Activities info
********************************************/
let totalCost = 0;
// disables the checkboxes for conflicting activities
function disableActivities (clickTarget, clickedDate, disableBoolean){
  $(".activities [type=checkbox]").each((i, activity) => {
    const activityDate = $(activity).attr("data-day-and-time");
    if (activityDate === clickedDate && activity !== clickTarget){
      $(activity).prop("disabled", disableBoolean);
    }
  });
}
// Fires disableActivities and adds the cost of the clicked activity to the total
$(".activities [type=checkbox]").change((e) => {
  const clickedCost = $(e.target).attr("data-cost");
  const clickedDate = $(e.target).attr("data-day-and-time");
  if ($(e.target).prop("checked")){
    totalCost += parseInt(clickedCost);
    disableActivities (e.target, clickedDate, true);
  } else {
    totalCost -= parseInt(clickedCost);
    disableActivities (e.target, clickedDate, false);
  }
  $(".total span").text(`$${totalCost}`);
});

/********************************************
Section Payment info
********************************************/
/* Credit card option is initially selected when the page (re-)loads. Other than that, this function iterates over the
payment options and shows the div of the selection, hiding the others.
*/
function displayPaymentOptions(firstLoad){
  if (firstLoad){
  $("#payment option").first().hide();
  $("option[value='credit card']").prop("selected", true);
}
  $("#payment option").each((i, option) => {
    const modOptionValue = option.value.replace(/\s/, "-");
    const paymentDiv = `#${modOptionValue}`;
    if ($(option).is(":selected")){
      $(paymentDiv).show()
    } else {
      $(paymentDiv).hide()
    }
  });
}

/* Besides firing displayPaymentOptions, this listener also erases any input values and error messages that might be present
in the credit card section. If the user switches back to credit card, he should see the div like it was on page load. Also,
erasing the error messages is important for the validation.
*/
$("#payment").change(() =>{
  displayPaymentOptions(false);
    if (!$("option[value='credit card']").prop("selected")){
      $("#credit-card input").each((i, input) => { $(input).val("");})
      if ($(".credit-card .error").length !== 0){
        $(".credit-card .error").remove();
      }
    }
});

/********************************************
Validation
********************************************/
const errorMessages = {
  name: '<p class="error" id="nameError">Please enter your first and last name separated by a space. No other characters allowed.</p>',
  email: '<p class="error" id="emailError">Please enter a valid Email-adress!</p>',
  design: '<p class="error" id="designError">Please select a shirt design & color!</p>',
  activities: '<p class="error" id="activityError">Please select at least one activity!</p>',
  ccBlank: '<p class="error" id="ccNumberError">Please enter a credit card number.</p>',
  ccNoNumber: '<p class="error" id="ccNumberError">Credit card number contains invalid characters. Only non-separated numbers are allowed.</p>',
  ccLength: '<p class="error" id="ccNumberError">Invalid credit card number. The card number must be 13 to 16 digits long and contain no spaces.</p>',
  zipCode: '<p class="error" id="zipCodeError">The Zip code must be 5 digits long and contain no spaces.</p>',
  cvv: '<p class="error" id="cvvError">The CVV is 3 digits long. You can find it on the back of your Credit Card.</p>'
};
/* emailRegex is oriented at the RFC3696 guideline for Email- /URL-adresses but not 100% verified.
nameRegex accepts a first and last name separated with a space, without allowing the most common special characters or numbers.
*/
const nameRegex = /^[^\d\s\/\\!"`´\^~§$€%&()=\{\}\?\+\*\#,;.:\-_|@\[\]<>°]+\s[^\d\s\/\\!"`´\^~§$€%&()=\{\}\?\+\*\#,;.:\-_|@\[\]<>°]+$/i;
const emailRegex = /^[^\s".,:\\@\[\]]+\.?[^\s".,:\\@\[\]]+@[^\s.",:\\@\[\]][^\s",:\\@\[\]]+\.(?!-)[a-z\d]+-*[a-z\d]+$/i;
const cardRegex = /^\d+$/;
const zipRegex = /^\d{5}(?!.)/;
const cvvRegex = /^\d{3}(?!.)/;

// removes any matching error elements from the DOM, if (errorBoolean) then prepends a new message to the corresponding node.
function toggleError (errorBoolean, errorID, relatedNode, messageHTML){
  if (errorID.length !== 0) {
    $(errorID).remove();
  }
  if (errorBoolean){
  relatedNode.prepend(messageHTML);
  }
}

// Based on the user input, this function generates one of three possible error messages for the credit card number or deletes an existing one.
function ccErrorEvaluation (){
  const input = $("#cc-num").val();
    if (input === ""){
     toggleError(true, $("#ccNumberError"), $(".credit-card"), errorMessages.ccBlank);
    }
    else if (!cardRegex.test(input)) {
      toggleError(true, $("#ccNumberError"), $(".credit-card"), errorMessages.ccNoNumber);
    }
    else if (input.length <13 || input.length >16){
      toggleError(true, $("#ccNumberError"), $(".credit-card"), errorMessages.ccLength);
    }
    else {
      toggleError(false, $("#ccNumberError"))
    }
}

// Dynamic input validation for the emailadress
$("#mail").on("keyup", (e) =>{
    if (!emailRegex.test($("#mail").val())){
      toggleError(true, $("#emailError"), $("label[for=mail]"), errorMessages.email)
    } else {
      toggleError(false, $("#emailError"))
    }
  });

/* As the Grand Judge of success, validateForm runs all validation tests on the relevant input fields,
eventually spitting out ugly error messages or banishing them into oblivion.
*/
function validateForm(){
  if (!nameRegex.test($("#name").val())){
    toggleError(true, $("#nameError"), $("label[for=name]"), errorMessages.name)
  } else {
    toggleError(false, $("#nameError"))
  }
// Trigger warning
  $("#mail").trigger("keyup");

  if ($("#design option").first().prop("selected")){
    toggleError(true, $("#designError"), $(".shirt-box"), errorMessages.design)
  } else {
    toggleError(false, $("#designError"))
  }

  if ($(".activities input:checked").length == 0){
    toggleError(true, $("#activityError"), $(".activities label").first(), errorMessages.activities)
  } else {
    toggleError(false, $("#activityError"))
  }

  if ($("option[value='credit card']").prop("selected")){
    ccErrorEvaluation ();

    if (!zipRegex.test($("#zip").val())){
      toggleError(true, $("#zipCodeError"), $(".credit-card"), errorMessages.zipCode)
    } else {
      toggleError(false, $("#zipCodeError"))
    }

    if (!cvvRegex.test($("#cvv").val())){
      toggleError(true, $("#cvvError"), $(".credit-card"), errorMessages.cvv)
    } else {
      toggleError(false, $("#cvvError"))
    }
  }
}

//The Grand Judge's submissive right hand, preventing the user from his futile attempts on submitting inferior data
$("form").submit((e) =>{
  validateForm();
  if ($(".error").length !== 0){
    e.preventDefault();
  }
});

setPage();
