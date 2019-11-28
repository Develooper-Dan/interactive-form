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
}

setPage();

$("#title").change((e) => {
  if ($(e.target).val() === "other"){
    $("#other-title").show();
  } else {
    $("#other-title").hide();
  }
});


$("#design").change((e) => {
  $("#design option").first().hide().prop("selected", false);
  let foundItems =[];
  if ($(e.target).val() === "js puns"){
    const punRegEx= /(?:puns)/i;
    $("#color option").each((i, shirt) => {
      if (punRegEx.test($(shirt).text())){
        $(shirt).show();
        foundItems.push($(shirt));
      } else { $(shirt).hide().prop("selected", false);
    }
    });
  }
  if ($(e.target).val() === "heart js"){
    const heartRegEx= /(?:js shirt)/i;
    $("#color option").each((i, shirt) => {
      if (heartRegEx.test($(shirt).text())){
        $(shirt).show();
        foundItems.push($(shirt));
      } else { $(shirt).hide().prop("selected", false);
    }
    });
  }
    foundItems[0].prop("selected", true);
});

$ (".activities").append('<p class="total">Total: <span>$0</span></p>');

let totalCost = 0;

$(".activities [type=checkbox]").change((e) => {
  const clickedCost = $(e.target).attr("data-cost");
  const clickedDate = $(e.target).attr("data-day-and-time");
  if ($(e.target).prop("checked")){
    totalCost += parseInt(clickedCost);
    $(".activities [type=checkbox]").each((i, activity) => {
      const activityDate = $(activity).attr("data-day-and-time");
      if (activityDate === clickedDate && activity !== e.target){
        $(activity).prop("disabled", true);
      }
    });
  } else {
    totalCost -= parseInt(clickedCost);
    $(".activities [type=checkbox]").each((i, activity) => {
      const activityDate = $(activity).attr("data-day-and-time");
      if (activityDate === clickedDate && activity !== e.target){
        $(activity).prop("disabled", false);
      }
    });
  }
  $(".total span").text(`$${totalCost}`);
});
