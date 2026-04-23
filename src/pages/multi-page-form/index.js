import { router } from "../../router";
//import * as multiJSON from '../../forms/liquidation_statement.json';
//import * as multiJSON from '../../forms/singlePage.json';
import { getFormDefinition } from "../../forms";

import { createForm } from "../../ui/createForm";
import { checkEligibilityEvent, goToPrevPageEvent, goToNextEvent, startApplicationEvent, restoreSavedSubmissionEvent } from "../../local-formio.events";
import { PasteTableComponent } from '@bc/formio-paste-table';
import { Components } from 'formiojs';
import 'tabulator-tables/dist/css/tabulator.min.css';
Components.addComponent('pasteTable', PasteTableComponent);
export function multiPage(formKey = "pasteTable") {
  const formDef = getFormDefinition(formKey);
  if (!formDef) {
    alert(`Form definition for key "${formKey}" not found.`);
    return;
  }
  document.querySelector('#app').innerHTML = `
    <h2>${formDef.title}</h2>
    <button id="backBtn" type="button">Back</button>
    <div id="formioMultipage"></div>
  `;

  var backButton = document.getElementById("backBtn");
  if (backButton) {
    backButton.addEventListener("click", function () {
      router.navigate("/");
    });
  }
  function setChoicesTabIndex(form) {
    form.everyComponent((component) => {
      const selectComp = component && component.component.type === "select";
      if (!selectComp) return;
      try {

        if (selectComp && component.component.widget && component.component.widget === "choicesjs") {
          const outerElem = component.choices && component.choices.containerOuter.element;
          if (outerElem && outerElem.tabIndex === -1) {

            outerElem.tabIndex = 0;
          }
        }

      } catch (e) {
        console.error("Error setting tabIndex for select component:", e);
      }
    })
  }

  function setDateValidationFale(form) {
    form.everyComponent((component) => {
      if (component.component.validate.required === true) {
        component.component.validate.required = false;
      }
      if (component.component.type === "day") {
        if (component.component.maxDate || component.component.minDate) {
          component.component.maxDate = "";
          component.component.minDate = "";
        }
      }

    })
  }
  function generateForm() {

    createForm(document.getElementById("formioMultipage"), formDef.formJSON, function (form) {
      console.log("Form created:", form);
      checkEligibilityEvent(form);
      goToPrevPageEvent(form);
      goToNextEvent(form);
      startApplicationEvent(form);
      form.on('change', () => {
        setChoicesTabIndex(form);
      });
      setDateValidationFale(form);
      //restoreSavedSubmissionEvent(form);


    });

  }
  generateForm();
}

multiPage();

// Create MultiPageForm

