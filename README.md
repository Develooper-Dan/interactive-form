Treehouse Techdegree:
# FSJS project 3 - Interactive form

The aim of this project was to use unobtrusive JavaScript and the jQuery-library to enhance the UX of a form by including different kinds of feedback depending on the user input. The HTML-Document as well as the .css were provided by Treehouse, I only added some .css for the display of error messages and the text of disabled checkboxes.

 In more detail:
 - The T-Shirt info section only shows the color drop down menu if the user selects a design Theme and only the corresponding colors are shown
 - The Activities section should add the cost of the chosen activities to the total. Also, conflicting activities had to be disabled
 - In the Payment section, credit card is set as the default payment option and the other options are hidden
 - In addition, if the user tries to submit his input all sections are checked for valid information. For example, the name input doesn't allow
  numbers or special characters, at least one activity had to be chosen and the credit card input fields only accept the correct amount of digits
 - The error message for the email input is generated dynamically as long as the user doesn't type in a valid email adress
 - The credit card field throws different errors depending on where the error occured and what caused the errors
