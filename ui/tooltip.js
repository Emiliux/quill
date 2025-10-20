import cspStyleManager from '../core/csp-utils';

class Tooltip {
  constructor(quill, boundsContainer) {
    this.quill = quill;
    this.boundsContainer = boundsContainer || document.body;
    this.root = quill.addContainer('ql-tooltip');
    this.root.innerHTML = this.constructor.TEMPLATE;
    if (this.quill.root === this.quill.scrollingContainer) {
      this.quill.root.addEventListener('scroll', () => {
        cspStyleManager.setMargin(this.root, 'Top', -1*this.quill.root.scrollTop);
      });
    }
    this.hide();
  }

  hide() {
    this.root.classList.add('ql-hidden');
  }

  position(reference) {
    let left = reference.left + reference.width/2 - this.root.offsetWidth/2;
    // root.scrollTop should be 0 if scrollContainer !== root
    let top = reference.bottom + this.quill.root.scrollTop;
    cspStyleManager.setPosition(this.root, left, top);
    this.root.classList.remove('ql-flip');
    let containerBounds = this.boundsContainer.getBoundingClientRect();
    let rootBounds = this.root.getBoundingClientRect();
    let shift = 0;
    if (rootBounds.right > containerBounds.right) {
      shift = containerBounds.right - rootBounds.right;
      cspStyleManager.setPosition(this.root, left + shift, top);
    }
    if (rootBounds.left < containerBounds.left) {
      shift = containerBounds.left - rootBounds.left;
      cspStyleManager.setPosition(this.root, left + shift, top);
    }
    if (rootBounds.bottom > containerBounds.bottom) {
      let height = rootBounds.bottom - rootBounds.top;
      let verticalShift = reference.bottom - reference.top + height;
      cspStyleManager.setPosition(this.root, left, top - verticalShift);
      this.root.classList.add('ql-flip');
    }
    return shift;
  }

  show() {
    this.root.classList.remove('ql-editing');
    this.root.classList.remove('ql-hidden');
  }
}


export default Tooltip;
