export default {
  mounted(el) {
    el.style.opacity = 0
    el.style.transform = "translateY(20px)"
    el.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out"

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = 1
          el.style.transform = "translateY(0)"
          observer.unobserve(el)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
  },
}
