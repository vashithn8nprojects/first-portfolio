document.addEventListener('DOMContentLoaded', () => {
  const htmlElement = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const navMenu = document.querySelector('.nav-menu');
  const taglineElement = document.getElementById('typing-animation');
  const backToTopButton = document.getElementById('back-to-top');
  const footerYear = document.getElementById('current-year');
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.querySelector('.form-status');
  const progressCircle = document.querySelector('.progress-ring-progress');
  const radius = progressCircle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;

  progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
  progressCircle.style.strokeDashoffset = circumference;

  // 1. Theme Toggle
  const currentTheme = localStorage.getItem('theme') || 'dark';
  htmlElement.setAttribute('data-theme', currentTheme);

  if (currentTheme === 'dark') {
    themeToggle.querySelector('.fa-moon').style.display = 'block';
    themeToggle.querySelector('.fa-sun').style.display = 'none';
  } else {
    themeToggle.querySelector('.fa-moon').style.display = 'none';
    themeToggle.querySelector('.fa-sun').style.display = 'block';
  }

  themeToggle.addEventListener('click', () => {
    let theme = htmlElement.getAttribute('data-theme');
    if (theme === 'dark') {
      htmlElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      themeToggle.querySelector('.fa-moon').style.display = 'none';
      themeToggle.querySelector('.fa-sun').style.display = 'block';
    } else {
      htmlElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      themeToggle.querySelector('.fa-moon').style.display = 'block';
      themeToggle.querySelector('.fa-sun').style.display = 'none';
    }
  });

  // 2. Mobile Menu Toggle
  hamburgerMenu.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburgerMenu.classList.toggle('active');
    document.body.classList.toggle('no-scroll'); // Prevent scroll when menu is open
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        hamburgerMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
      }
      // Smooth scroll handled by default browser behavior with `scroll-behavior: smooth`
    });
  });

  // 3. Typing Animation for Hero Tagline
  const taglines = [
    "Building beautiful and functional web experiences.",
    "Passionate about clean code and innovative solutions.",
    "Turning ideas into seamless digital realities."
  ];
  let taglineIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;
  let delayBetweenTaglines = 2000; // 2 seconds

  function typeWriter() {
    const currentTagline = taglines[taglineIndex];
    if (isDeleting) {
      taglineElement.textContent = currentTagline.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      taglineElement.textContent = currentTagline.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentTagline.length) {
      typingSpeed = delayBetweenTaglines; // Pause at end of typing
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      taglineIndex = (taglineIndex + 1) % taglines.length;
      typingSpeed = 100;
    }

    setTimeout(typeWriter, typingSpeed);
  }

  // Delay starting the typing animation until the hero section is visible
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.animate-slide-up').forEach((el, index) => {
          el.style.transitionDelay = `${0.1 * index}s`;
          el.classList.add('animate-slide-up');
        });
        entry.target.querySelector('.hero-scroll-indicator').classList.add('animate-fade-in');
        setTimeout(typeWriter, 1000); // Start typing animation after hero intro animations
        heroObserver.unobserve(entry.target); // Only animate once
      }
    });
  }, { threshold: 0.5 });
  heroObserver.observe(document.getElementById('hero'));


  // 4. Intersection Observer for Scroll Animations
  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        // Animate elements with delay inside section
        entry.target.querySelectorAll('.animate-slide-up-delay, .skill-item').forEach((el, index) => {
          el.style.transitionDelay = `${0.1 * index}s`;
          el.classList.add('animate');

          // Skill bar animation
          if (el.classList.contains('skill-item')) {
            const skillLevel = el.dataset.level;
            const skillProgress = el.querySelector('.skill-progress');
            if (skillProgress && skillLevel) {
              skillProgress.style.width = `${skillLevel}%`;
            }
          }
        });
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -100px 0px' });

  sections.forEach(section => {
    if (section.id !== 'hero') { // Hero is handled separately
      section.classList.add('section-hidden');
      sectionObserver.observe(section);
    }
  });

  // 5. Active Nav Link Highlighting
  const highlightActiveLink = () => {
    let currentActive = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop - sectionHeight / 3) {
        currentActive = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(currentActive)) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', highlightActiveLink);
  highlightActiveLink(); // Call on load

  // 6. Dynamic Year in Footer
  footerYear.textContent = new Date().getFullYear();

  // 7. Back-to-Top Button with Scroll Progress Indicator
  const updateScrollProgress = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    const clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
    const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;

    if (scrollTop > 300) {
      backToTopButton.classList.add('show');
    } else {
      backToTopButton.classList.remove('show');
    }

    const offset = circumference - (scrollPercentage / 100) * circumference;
    progressCircle.style.strokeDashoffset = offset;
  };

  window.addEventListener('scroll', updateScrollProgress);
  updateScrollProgress(); // Set initial state

  backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 8. Contact Form Validation
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');

    formStatus.style.display = 'none';
    formStatus.classList.remove('success', 'error');

    if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
      showFormStatus('Please fill in all fields.', 'error');
      return;
    }

    if (!validateEmail(email.value)) {
      showFormStatus('Please enter a valid email address.', 'error');
      return;
    }

    // In a real application, you would send this data to a server
    // For this portfolio, we just simulate success
    showFormStatus('Message sent successfully! I will get back to you soon.', 'success');
    contactForm.reset();
  });

  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  function showFormStatus(message, type) {
    formStatus.textContent = message;
    formStatus.classList.add(type);
    formStatus.style.display = 'block';
  }
});
