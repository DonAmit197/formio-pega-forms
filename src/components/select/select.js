// AccessibleSelectComponent.js
import { attachNZBNMeta } from "../componentUtils/attachNZBNMeta";


// In local dev, Formio will be on window.
// In Pega, this same pattern will still work once bundled.
const SelectComponent =
  window.Formio &&
  window.Formio.Components &&
  window.Formio.Components.components &&
  window.Formio.Components.components.select;

// We'll fill this only if SelectComponent exists
let AccessibleSelectComponent = null;

if (SelectComponent) {
  AccessibleSelectComponent = class AccessibleSelectComponent extends SelectComponent {


    /**
     * Override Choices config.
     */
    choicesOptions() {
      const baseOptions = super.choicesOptions() || {};

      // IDs for ARIA
      //const labelID = 'l-' + this.id + '-' + this.component.key;
      //const descpID = 'd-' + this.id + '-' + this.component.key;
      //const newLabelID = labelID + (this.component.description ? ' ' + descpID : '');

      const classNames = Object.assign({}, baseOptions.classNames || {}, {
        containerOuter: 'choices form-group formio-choices',
        containerInner: 'form-control formio-choices__inner custom-select-inner',
      });

      return Object.assign({}, baseOptions, {
        classNames,
        callbackOnInit() {
          // `this` is the Choices instance
          // if (this.containerInner && this.containerInner.element) {
          //   this.containerInner.element.removeAttribute('tabindex');
          // }
        },
        // For your own reference; Choices itself does not use this
        //labelId: newLabelID,
      });
    }

    /**
     * Override attach to handle tabindex.
     */
    attach(element) {
      const result = super.attach(element);

      if (this.choices && this.focusableElement) {

        this.focusableElement.setAttribute('aria-labelledby', 'l-' + this.id + '-' + this.component.key);
        if (this.component.description) {
          this.focusableElement.setAttribute(
            'aria-describedby',
            'd-' + this.id + '-' + this.component.key
          );
        }
        if (!this.focusableElement.tabIndex || this.focusableElement.tabIndex < 0) {
          this.focusableElement.setAttribute('tabindex', '0');
        }
        this.focusableElement.setAttribute('role', 'combobox');
        this.focusableElement.setAttribute('aria-autocomplete', 'list');

        // NOTE: Leaving this commented out for now; may be needed later

        // const outer =
        //   this.choices.containerOuter && this.choices.containerOuter.element;
        // if (outer) {
        //   outer.removeAttribute('role');
        //   outer.removeAttribute('aria-autocomplete');
        // }
      }
      /**
       * Attach NZBN Meta to submission data when component value changes.
       *
       * @param {Object} comp - The Formio component instance
       * !!Warning:
       * Be careful only if localhost use this, Dont use in production
       */
      attachNZBNMeta(this, { compKey: 'data_entity_nzbn' });

      return result;
    }
  };
} else {
  // Optional: nice warning in dev if Formio isn't present yet
  console.warn(
    'AccessibleSelectComponent: window.Formio.Components.components.select not available.'
  );
}

/**
 * Plugin object for Formio.use().
 * If SelectComponent was missing, this will be null.
 */
const AccessibleSelectPlugin =
  SelectComponent && AccessibleSelectComponent
    ? {
      components: {
        select: AccessibleSelectComponent,
      },
    }
    : null;

export default AccessibleSelectPlugin;
