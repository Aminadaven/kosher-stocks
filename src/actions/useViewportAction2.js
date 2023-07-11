let intersectionObserver;
let previousY = 0;

function ensureIntersectionObserver() {
  if (intersectionObserver) return;

  intersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // console.log(entry);
        // const eventName = entry.isIntersecting ? 'enterViewport' : 'exitViewport';
        const eventName = 'enterViewport';
        if (!entry.isIntersecting)
          return;
        const currentY = entry.boundingClientRect.y;
        console.log(currentY);
        console.log(previousY);
        const direction = currentY < previousY ? 'top' : 'bottom';
        previousY = currentY;
        // console.log(direction);
        entry.target.dispatchEvent(
          new CustomEvent(eventName, { detail: direction })
        );
        
      // intersectionObserver.unobserve(entry.target);
      });
    }
  );
}

export default function viewport(element) {
  ensureIntersectionObserver();

  intersectionObserver.observe(element);

  return {
    // destroy() {
    //   intersectionObserver.unobserve(element);
    // },
  };
}
