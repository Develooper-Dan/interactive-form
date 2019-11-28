function setPage() {
  $("#name").focus();
  $("#other-title").hide();
  $("#design option").first().prop("selected", true);
  $("#color option").first().prop("selected", true);
  $("#color option").each((index) => {
    if (index>0){
      $("#color option").hide();
    }
  });
  $(":checked").each((i, e) => {
    $(e).prop("checked", false);
  });
  $ (".activities").append('<p class="total">Total: <span>$0</span></p>');
}

setPage();
let totalCost = 0;

$("#title").change((e) => {
  if ($(e.target).val() === "other"){
    $("#other-title").show();
  } else {
    $("#other-title").hide();
  }
});

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

$("#design").change((e) => {
  $("#design option").first().hide().prop("selected", false);
  if ($(e.target).val() === "js puns"){
    showSelectedDesign(/(?:puns)/i);
  } else {
    showSelectedDesign(/(?:js shirt)/i);
    }
  });

function disableActivities (clickTarget, clickedDate, disableBoolean){
  $(".activities [type=checkbox]").each((i, activity) => {
    const activityDate = $(activity).attr("data-day-and-time");
    if (activityDate === clickedDate && activity !== clickTarget){
      $(activity).prop("disabled", disableBoolean);
    }
  });
}

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

// function hidePaymentOptions(){
  $("#payment option").first().hide();
  $("#payment option").each((i, option) => {
    const paymentDiv = `#${option.value}`;
    if (option.value === "credit card"){
      $(option).prop("selected", true);
    } else { $(paymentDiv).hide()
    }
});
