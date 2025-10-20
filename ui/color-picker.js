import Picker from './picker';
import cspStyleManager from '../core/csp-utils';


class ColorPicker extends Picker {
  constructor(select, label) {
    super(select);
    this.label.innerHTML = label;
    this.container.classList.add('ql-color-picker');
    [].slice.call(this.container.querySelectorAll('.ql-picker-item'), 0, 7).forEach(function(item) {
      item.classList.add('ql-primary');
    });
  }

  buildItem(option) {
    let item = super.buildItem(option);
    cspStyleManager.setBackgroundColor(item, option.getAttribute('value') || '');
    return item;
  }

  selectItem(item, trigger) {
    super.selectItem(item, trigger);
    let colorLabel = this.label.querySelector('.ql-color-label');
    let value = item ? item.getAttribute('data-value') || '' : '';
    if (colorLabel) {
      if (colorLabel.tagName === 'line') {
        cspStyleManager.setSVGStyle(colorLabel, 'stroke', value);
      } else {
        cspStyleManager.setSVGStyle(colorLabel, 'fill', value);
      }
    }
  }
}


export default ColorPicker;
