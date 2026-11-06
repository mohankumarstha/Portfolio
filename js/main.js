(function () {
  "use strict";

  var body = document.body;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  function $(selector, context) {
    return (context || document).querySelector(selector);
  }

  function $$(selector, context) {
    return Array.prototype.slice.call((context || document).querySelectorAll(selector));
  }

  /* ---------------------------------------------------------
     Full-screen menu
     --------------------------------------------------------- */
  var menuToggle = $("#menuToggle");
  var menuLabel = $(".menu-label");
  var nav = $("#primaryNav");

  function setMenu(open) {
    body.classList.toggle("nav-open", open);

    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    }

    if (menuLabel) {
      menuLabel.textContent = open ? "Close" : "Menu";
    }
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      setMenu(!body.classList.contains("nav-open"));
    });
  }

  if (nav) {
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setMenu(false);
    });
  }

  var brandLink = $(".site-header .brand");

  if (brandLink) {
    brandLink.addEventListener("click", function (event) {
      event.preventDefault();
      setMenu(false);
      window.scrollTo({ top: 0, behavior: "auto" });
    });
  }

  $$(".site-header a[href^='#']").forEach(function (link) {
    link.addEventListener("click", function (event) {
      var id = link.getAttribute("href");
      var target = id && id !== "#" ? document.querySelector(id) : null;

      setMenu(false);

      if (!target) return;

      event.preventDefault();

      var top =
        id === "#home" ? 0 : target.getBoundingClientRect().top + window.pageYOffset;

      window.scrollTo({
        top: top,
        behavior: reduceMotion.matches ? "auto" : "smooth"
      });

      if (history.pushState) history.pushState(null, "", id);
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && body.classList.contains("nav-open")) {
      setMenu(false);
      if (menuToggle) menuToggle.focus();
    }
  });

  /* ---------------------------------------------------------
     Sticky header + scroll progress
     --------------------------------------------------------- */
  var sidePercent = $(".side-nav-percent");
  var ticking = false;

  function updateScroll() {
    var y = window.scrollY || window.pageYOffset;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var ratio = max > 0 ? Math.min(y / max, 1) : 0;

    if (sidePercent) {
      var percent = Math.round(ratio * 100);
      sidePercent.textContent =
        (percent < 10 ? "0" : "") + percent + "%";
    }

    ticking = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateScroll);
    },
    { passive: true }
  );

  updateScroll();

  /* ---------------------------------------------------------
     Active section in the nav
     --------------------------------------------------------- */
  var navLinks = $$(".nav a[href^='#']");
  var sideDots = $$(".side-nav-dot");
  var sections = navLinks
    .map(function (link) {
      return document.querySelector(link.getAttribute("href"));
    })
    .filter(Boolean);
  var homeSection = document.querySelector("#home");

  if (homeSection && sections.indexOf(homeSection) === -1) {
    sections.push(homeSection);
  }

  if ("IntersectionObserver" in window && sections.length) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = "#" + entry.target.id;

          navLinks.forEach(function (link) {
            link.classList.toggle("is-active", link.getAttribute("href") === id);
          });

          sideDots.forEach(function (dot) {
            dot.classList.toggle("is-active", dot.getAttribute("href") === id);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach(function (section) {
      navObserver.observe(section);
    });
  }

  /* ---------------------------------------------------------
     Scroll reveal
     --------------------------------------------------------- */
  var revealEls = $$(".reveal");

  function revealAll() {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  if (revealEls.length) {
    revealEls.forEach(function (el) {
      el.style.setProperty("--d", el.getAttribute("data-delay") || 0);
    });

    if ("IntersectionObserver" in window && !reduceMotion.matches) {
      var revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
      );

      revealEls.forEach(function (el) {
        revealObserver.observe(el);
      });

      window.setTimeout(function () {
        if (!document.querySelector(".reveal.is-visible")) revealAll();
      }, 2400);
    } else {
      revealAll();
    }
  }

  /* Split the headline into letters so they can animate one by one. */
  var heroTitle = $(".hero-title");
  if (heroTitle) {
    var letterIndex = 0;
    var heroDirs = [
      [0, 70],
      [0, -70],
      [-70, 0],
      [70, 0],
      [-55, 55],
      [55, 55],
      [-55, -55],
      [55, -55]
    ];

    $$(".hero-title .line > span").forEach(function (lineSpan) {
      var text = lineSpan.textContent;
      var frag = document.createDocumentFragment();

      lineSpan.textContent = "";

      for (var i = 0; i < text.length; i++) {
        var char = text.charAt(i);
        var letter = document.createElement("span");

        var dir = heroDirs[Math.floor(Math.random() * heroDirs.length)];
        var tx = dir[0] + (Math.random() * 24 - 12);
        var ty = dir[1] + (Math.random() * 24 - 12);
        var rot = Math.random() * 18 - 9;

        letter.className = "letter";
        letter.style.setProperty("--i", letterIndex++);
        letter.style.setProperty("--tx", tx.toFixed(1) + "px");
        letter.style.setProperty("--ty", ty.toFixed(1) + "px");
        letter.style.setProperty("--rot", rot.toFixed(1) + "deg");

        if (char === " ") {
          letter.classList.add("letter-space");
          letter.innerHTML = "&nbsp;";
        } else {
          letter.textContent = char;
        }

        frag.appendChild(letter);
      }

      lineSpan.appendChild(frag);
    });

    /* Guarantee the headline is visible even if CSS animations are paused
       (background tabs, unusual browsers). */
    window.setTimeout(function () {
      heroTitle.classList.add("is-ready");
    }, 2200);
  }

  /* Split section titles into letters and reveal them when scrolled into view. */
  var splitTitles = $$("[data-split]");

  if (splitTitles.length) {
    var splitDirs = [
      [0, 70],
      [0, -70],
      [-70, 0],
      [70, 0],
      [-55, 55],
      [55, 55],
      [-55, -55],
      [55, -55]
    ];

    splitTitles.forEach(function (title) {
      var text = title.textContent.replace(/\s+/g, " ").trim();
      var words = text.split(" ");
      var index = 0;
      var frag = document.createDocumentFragment();

      title.textContent = "";
      title.setAttribute("aria-label", text);

      words.forEach(function (word, wordIndex) {
        var wordEl = document.createElement("span");
        wordEl.className = "word";

        for (var i = 0; i < word.length; i++) {
          var letter = document.createElement("span");
          var dir = splitDirs[Math.floor(Math.random() * splitDirs.length)];
          var tx = dir[0] + (Math.random() * 24 - 12);
          var ty = dir[1] + (Math.random() * 24 - 12);
          var rot = Math.random() * 18 - 9;

          letter.className = "letter";
          letter.style.setProperty("--i", index++);
          letter.style.setProperty("--tx", tx.toFixed(1) + "px");
          letter.style.setProperty("--ty", ty.toFixed(1) + "px");
          letter.style.setProperty("--rot", rot.toFixed(1) + "deg");
          letter.textContent = word.charAt(i);

          wordEl.appendChild(letter);
        }

        frag.appendChild(wordEl);

        if (wordIndex < words.length - 1) {
          frag.appendChild(document.createTextNode(" "));
        }
      });

      title.appendChild(frag);

      if ("IntersectionObserver" in window && !reduceMotion.matches) {
        var titleObserver = new IntersectionObserver(
          function (entries, observer) {
            entries.forEach(function (entry) {
              if (!entry.isIntersecting) return;
              entry.target.classList.add("is-revealed");
              observer.unobserve(entry.target);
            });
          },
          { threshold: 0.35 }
        );

        titleObserver.observe(title);
      } else {
        title.classList.add("is-revealed");
      }
    });
  }

  /* Split paragraphs into words and reveal them when scrolled into view. */
  var textReveals = $$("[data-words]");

  if (textReveals.length) {
    var splitTextNode = function (node, counter) {
      var parts = node.textContent.split(/(\s+)/);
      var frag = document.createDocumentFragment();

      parts.forEach(function (part) {
        if (!part) return;

        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part));
          return;
        }

        var word = document.createElement("span");
        word.className = "word";
        word.style.setProperty("--i", counter.value++);
        word.style.setProperty("--rot", (Math.random() * 8 - 4).toFixed(1) + "deg");
        word.textContent = part;
        frag.appendChild(word);
      });

      return frag;
    };

    textReveals.forEach(function (el) {
      var counter = { value: 0 };
      var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
      var nodes = [];

      while (walker.nextNode()) nodes.push(walker.currentNode);

      nodes.forEach(function (node) {
        if (!node.textContent.trim()) return;
        node.parentNode.replaceChild(splitTextNode(node, counter), node);
      });

      if ("IntersectionObserver" in window && !reduceMotion.matches) {
        var wordObserver = new IntersectionObserver(
          function (entries, observer) {
            entries.forEach(function (entry) {
              if (!entry.isIntersecting) return;
              entry.target.classList.add("is-revealed");
              observer.unobserve(entry.target);
            });
          },
          { threshold: 0.2 }
        );

        wordObserver.observe(el);
      } else {
        el.classList.add("is-revealed");
      }
    });
  }

  /* Split button labels into letters for the hover animation. */
  $$(".btn").forEach(function (btn) {
    var letterIndex = 0;

    Array.prototype.slice.call(btn.childNodes).forEach(function (node) {
      if (node.nodeType !== 3) return;

      var text = node.textContent.replace(/\s+/g, " ").trim();
      if (!text) return;

      var label = document.createElement("span");
      label.className = "btn-label";

      for (var i = 0; i < text.length; i++) {
        var char = text.charAt(i);
        var letter = document.createElement("span");
        var angle = Math.random() * Math.PI * 2;
        var dist = 16 + Math.random() * 20;

        letter.className = "btn-letter";
        letter.style.setProperty("--bi", letterIndex++);
        letter.style.setProperty("--bx", (Math.cos(angle) * dist).toFixed(1) + "px");
        letter.style.setProperty("--by", (Math.sin(angle) * dist).toFixed(1) + "px");
        letter.style.setProperty("--brot", (Math.random() * 30 - 15).toFixed(1) + "deg");

        if (char === " ") {
          letter.innerHTML = "&nbsp;";
        } else {
          letter.textContent = char;
        }

        label.appendChild(letter);
      }

      btn.replaceChild(label, node);
    });
  });

  /* ---------------------------------------------------------
     Custom follow cursor (desktop, fine pointer only)
     --------------------------------------------------------- */
  var cursorDot = $(".cursor-dot");

  if (cursorDot && finePointer.matches && !reduceMotion.matches) {
    var dotX = window.innerWidth / 2;
    var dotY = window.innerHeight / 2;
    var targetX = dotX;
    var targetY = dotY;
    var cursorVisible = false;
    var hoverSelector = "a, button, .project-link, [data-cursor]";

    document.addEventListener("mousemove", function (event) {
      targetX = event.clientX;
      targetY = event.clientY;

      if (!cursorVisible) {
        cursorVisible = true;
        cursorDot.classList.add("is-visible");
      }
    });

    document.addEventListener("mouseleave", function () {
      cursorVisible = false;
      cursorDot.classList.remove("is-visible");
    });

    document.addEventListener("mouseover", function (event) {
      if (event.target.closest && event.target.closest(hoverSelector)) {
        cursorDot.classList.add("is-hover");
      }
    });

    document.addEventListener("mouseout", function (event) {
      if (event.target.closest && event.target.closest(hoverSelector)) {
        cursorDot.classList.remove("is-hover");
      }
    });

    (function followCursor() {
      dotX += (targetX - dotX) * 0.4;
      dotY += (targetY - dotY) * 0.4;

      cursorDot.style.transform =
        "translate3d(" + dotX + "px," + dotY + "px, 0)";

      window.requestAnimationFrame(followCursor);
    })();
  }

  /* ---------------------------------------------------------
     Count-up numbers
     --------------------------------------------------------- */
  var counters = $$("[data-count]");

  if (counters.length) {
    var runCount = function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;

      if (reduceMotion.matches) {
        el.textContent = String(target);
        return;
      }

      var startTime = null;
      var duration = 1200;

      var tick = function (now) {
        if (startTime === null) startTime = now;
        var progress = Math.min((now - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = String(Math.round(target * eased));
        if (progress < 1) window.requestAnimationFrame(tick);
      };

      window.requestAnimationFrame(tick);
    };

    if ("IntersectionObserver" in window) {
      var countObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            runCount(entry.target);
            countObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.6 }
      );

      counters.forEach(function (el) {
        countObserver.observe(el);
      });
    } else {
      counters.forEach(function (el) {
        el.textContent = el.getAttribute("data-count");
      });
    }
  }

  /* ---------------------------------------------------------
     Magnetic buttons
     --------------------------------------------------------- */
  if (finePointer.matches && !reduceMotion.matches) {
    $$(".btn").forEach(function (btn) {
      btn.addEventListener("mousemove", function (event) {
        var rect = btn.getBoundingClientRect();
        var x = (event.clientX - rect.left - rect.width / 2) * 0.16;
        var y = (event.clientY - rect.top - rect.height / 2) * 0.28;
        btn.style.setProperty("--tx", x.toFixed(1) + "px");
        btn.style.setProperty("--ty", y.toFixed(1) + "px");
      });

      btn.addEventListener("mouseleave", function () {
        btn.style.setProperty("--tx", "0px");
        btn.style.setProperty("--ty", "0px");
      });
    });
  }

  /* ---------------------------------------------------------
     Copy email + toast
     --------------------------------------------------------- */
  var toast = $("#toast");
  var toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-on");

    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("is-on");
    }, 2600);
  }

  function legacyCopy(value) {
    var field = document.createElement("textarea");
    field.value = value;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();

    var ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (e) {
      ok = false;
    }

    document.body.removeChild(field);
    return ok;
  }

  $$(".copy-btn[data-copy]").forEach(function (button) {
    button.addEventListener("click", function () {
      var value = button.getAttribute("data-copy");
      var label = $("span", button);

      function done(ok) {
        if (!ok) {
          showToast("Copy failed — please select the email manually");
          return;
        }

        showToast("Email copied to clipboard");

        if (label) {
          var original = label.textContent;
          label.textContent = "Copied";
          window.setTimeout(function () {
            label.textContent = original;
          }, 1800);
        }
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(
          function () {
            done(true);
          },
          function () {
            done(legacyCopy(value));
          }
        );
      } else {
        done(legacyCopy(value));
      }
    });
  });

  /* ---------------------------------------------------------
     Print / Save as PDF
     --------------------------------------------------------- */
  var printBtn = $("#printBtn");
  if (printBtn) {
    printBtn.addEventListener("click", function () {
      window.print();
    });
  }

  /* ---------------------------------------------------------
     Year
     --------------------------------------------------------- */
  var year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
