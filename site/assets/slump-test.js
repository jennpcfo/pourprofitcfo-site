// The Profit Slump Test: nine questions, scored in the browser. Nothing is sent anywhere.
// Every question, answer, score and sentence lives in this one block, so wording changes happen here only.
(function () {
  "use strict";

  var BOOK = "https://calendar.app.google/zRN99heED6kefWTYA";

  // pts: 0 = healthy, 3 = strongest warning sign. sales: yearly sales used for the "each point of margin" arithmetic.
  var QUESTIONS = [
    { q: "About how much does your business bring in a year?", hint: "Total sales, a rough figure is fine.", key: "sales",
      a: [ { t: "Under $1 million", sales: 750000 }, { t: "$1 million to $2 million", sales: 1500000 },
           { t: "$2 million to $5 million", sales: 3500000 }, { t: "$5 million to $10 million", sales: 7500000 },
           { t: "$10 million to $15 million", sales: 12500000 }, { t: "More than $15 million", sales: 15000000, plus: true } ] },
    { q: "How do you set your prices on a bid?",
      a: [ { t: "From my overhead and a target margin I've worked out", pts: 0 },
           { t: "My costs plus a markup that's always worked", pts: 2 },
           { t: "Whatever the market will bear", pts: 2 },
           { t: "Mostly gut feel", pts: 3 } ],
      sign: "Your prices aren't tied to what it costs to run your business",
      why: "This is the most common way a busy contractor ends up with a thin year: every job looks fine and the year still comes up short." },
    { q: "Do you know the gross margin you need just to break even?",
      a: [ { t: "Yes, I have it written down", pts: 0 }, { t: "Roughly", pts: 2 }, { t: "No", pts: 3 } ],
      sign: "No break-even margin to bid above",
      why: "Without that number there is no line in the sand. You can't tell a good job from one that quietly loses money." },
    { q: "Compared with two years ago, how are your sales and profit?",
      a: [ { t: "Both are up", pts: 0 }, { t: "Sales are up, profit is flat or down", pts: 3 },
           { t: "Both are about the same", pts: 1 }, { t: "Both are down", pts: 2 } ],
      sign: "More work without more profit",
      why: "When sales grow and profit doesn't, costs and overhead have grown faster than your prices. That is the classic profit slump." },
    { q: "When a job is done, do you compare what it cost with what you estimated?",
      a: [ { t: "On every job", pts: 0 }, { t: "On the big jobs only", pts: 1 }, { t: "Rarely", pts: 2 }, { t: "Never", pts: 3 } ],
      sign: "Finished jobs aren't checked against the estimate",
      why: "If no one looks back, the same misses get bid again next season." },
    { q: "What happens with extra work and change orders in the field?",
      a: [ { t: "Always written up and billed", pts: 0 }, { t: "Usually billed, but some slip through", pts: 1 },
           { t: "Often done on a handshake and never billed", pts: 3 } ],
      sign: "Extra work that never gets billed",
      why: "Unbilled extra work is money you already earned and didn't collect." },
    { q: "How do you pay yourself?",
      a: [ { t: "A steady, fair wage for the work I do", pts: 0 }, { t: "A wage, but less than the job is worth", pts: 2 },
           { t: "Whatever is left at the end", pts: 3 } ],
      sign: "Your own pay isn't in the numbers",
      why: "When the owner is underpaid, the business looks more profitable than it really is, and prices get set too low." },
    { q: "Most months, how does cash feel?",
      a: [ { t: "A comfortable cushion in the bank", pts: 0 }, { t: "Tight some weeks", pts: 2 },
           { t: "I worry about making payroll", pts: 3 } ],
      sign: "Cash is tight in a busy business",
      why: "Thin margins, loan payments and slow collections all show up here first. Your profit report shows loan interest but not the payments themselves." },
    { q: "When do you see last month's numbers?",
      a: [ { t: "By the middle of the next month", pts: 0 }, { t: "A month or two later", pts: 2 }, { t: "At tax time", pts: 3 } ],
      sign: "Your numbers arrive too late to steer by",
      why: "Numbers that show up months later can't help you price this month's bids." }
  ];

  // Levels by share of the most warning points possible.
  var LEVELS = [
    { upTo: 25, name: "Holding firm",
      text: "Your answers show good habits: you know your numbers and price from them. The question left is whether the numbers themselves are right, and the Overhead Check confirms it." },
    { upTo: 50, name: "Early cracks",
      text: "A few signs your prices may not be keeping up with what it costs to run your business. Small gaps add up fast at your size." },
    { upTo: 75, name: "Slumping",
      text: "Several signs your prices have fallen behind your costs. This pattern usually shows up as being busy and short of money at the same time." },
    { upTo: 101, name: "Serious slump",
      text: "Most of the warning signs are there, and your prices, your pay and your cash are likely all feeling it. The good news: this is the most fixable kind of problem." }
  ];

  var MAX_PTS = QUESTIONS.reduce(function (s, q) {
    return s + q.a.reduce(function (m, a) { return Math.max(m, a.pts || 0); }, 0);
  }, 0);

  var answers = new Array(QUESTIONS.length);
  var at = 0;
  var card = document.getElementById("card");
  var bar = document.getElementById("bar");
  var count = document.getElementById("qcount");

  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "class") e.className = attrs[k]; else e.setAttribute(k, attrs[k]);
    });
    if (text != null) e.textContent = text;
    return e;
  }
  function money(n) { return "$" + Math.round(n).toLocaleString("en-US"); }

  function showQuestion() {
    var Q = QUESTIONS[at];
    bar.style.width = (at / QUESTIONS.length * 100) + "%";
    count.textContent = "QUESTION " + (at + 1) + " OF " + QUESTIONS.length;
    card.innerHTML = "";
    var h = el("h2", { tabindex: "-1", id: "qtitle" }, Q.q);
    card.appendChild(h);
    if (Q.hint) card.appendChild(el("p", { class: "hint" }, Q.hint));
    var opts = el("div", { class: "opts", role: "group", "aria-labelledby": "qtitle" });
    Q.a.forEach(function (A, i) {
      var b = el("button", { type: "button", class: "opt", "aria-pressed": answers[at] === i ? "true" : "false" }, A.t);
      b.addEventListener("click", function () {
        answers[at] = i;
        Array.prototype.forEach.call(opts.children, function (c) { c.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        setTimeout(function () {
          at += 1;
          if (at < QUESTIONS.length) showQuestion(); else showResult();
        }, 180);
      });
      opts.appendChild(b);
    });
    card.appendChild(opts);
    var row = el("div", { class: "nav-row" });
    var back = el("button", { type: "button", class: "linkbtn" }, "Back");
    back.hidden = at === 0;
    back.addEventListener("click", function () { at -= 1; showQuestion(); });
    row.appendChild(back);
    card.appendChild(row);
    h.focus({ preventScroll: true });
  }

  function gauge(pct) {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 200 120");
    svg.setAttribute("class", "gauge");
    svg.setAttribute("aria-hidden", "true");
    var ang = Math.PI * (1 - pct / 100);
    var x = 100 + 80 * Math.cos(ang), y = 105 - 80 * Math.sin(ang);
    var nx = 100 + 62 * Math.cos(ang), ny = 105 - 62 * Math.sin(ang);
    svg.innerHTML =
      '<defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9d6809"/><stop offset="1" stop-color="#ffd35f"/></linearGradient></defs>' +
      '<path d="M20 105 A80 80 0 0 1 180 105" fill="none" stroke="var(--line)" stroke-width="16"/>' +
      (pct > 0 ? '<path d="M20 105 A80 80 0 0 1 ' + x.toFixed(1) + ' ' + y.toFixed(1) + '" fill="none" stroke="url(#rg)" stroke-width="16"/>' : '') +
      '<line x1="100" y1="105" x2="' + nx.toFixed(1) + '" y2="' + ny.toFixed(1) + '" stroke="var(--ink)" stroke-width="4" stroke-linecap="round"/>' +
      '<circle cx="100" cy="105" r="8" fill="var(--ink)"/>';
    return svg;
  }

  function showResult() {
    bar.style.width = "100%";
    count.textContent = "YOUR RESULT";
    var pts = 0, signs = [], sales = null;
    QUESTIONS.forEach(function (Q, qi) {
      var A = Q.a[answers[qi]];
      if (Q.key === "sales") { sales = A; return; }
      pts += A.pts;
      if (A.pts >= 2) signs.push({ pts: A.pts, qi: qi, Q: Q });
    });
    var pct = Math.round(pts / MAX_PTS * 100);
    var li = 0; while (pct >= LEVELS[li].upTo) li += 1;
    var L = LEVELS[li];
    signs.sort(function (a, b) { return b.pts - a.pts || a.qi - b.qi; });

    card.innerHTML = "";
    card.className = "card result";
    var top = el("div", { class: "result-top" });
    top.appendChild(gauge(pct));
    var txt = el("div");
    var lvl = el("p", { class: "level l" + li, tabindex: "-1", id: "rtitle" }, L.name);
    txt.appendChild(lvl);
    txt.appendChild(el("p", { class: "score-line" }, "SLUMP READING " + pct + " OUT OF 100"));
    top.appendChild(txt);
    card.appendChild(top);
    card.appendChild(el("p", { class: "what" }, L.text));

    if (signs.length) {
      card.appendChild(el("h3", { class: "r-h" }, signs.length > 3 ? "Your top three warning signs" : "Your warning signs"));
      var ul = el("ul", { class: "signals" });
      signs.slice(0, 3).forEach(function (s) {
        var li2 = el("li");
        li2.appendChild(el("strong", null, s.Q.sign));
        li2.appendChild(el("span", null, s.Q.why));
        ul.appendChild(li2);
      });
      card.appendChild(ul);
    }

    if (sales) {
      var one = sales.sales * 0.01, three = sales.sales * 0.03;
      card.appendChild(el("h3", { class: "r-h" }, "What one point of margin is worth"));
      var m = el("div", { class: "money" });
      m.appendChild(el("p", { class: "big" }, money(one) + (sales.plus ? "+" : "") + " a year"));
      m.appendChild(el("p", null, "At " + (sales.plus ? "more than $15 million" : "about " + money(sales.sales)) +
        " in sales, every 1 point of margin your prices miss is about " + money(one) + (sales.plus ? " or more" : "") +
        " a year. A 3-point gap would be about " + money(three) + (sales.plus ? " or more" : "") + " a year."));
      m.appendChild(el("p", null, "This is simple arithmetic on your sales, not a measure of your business. The Overhead Check finds your real gap."));
      card.appendChild(m);
    }

    var next = el("div", { class: "next" });
    next.appendChild(el("div", { class: "eyebrow" }, "Your next step"));
    next.appendChild(el("h3", { style: "margin-top:8px" }, "The Overhead Check: $950"));
    next.appendChild(el("p", null, "We compare the margin you're earning with the margin you need, loan payments included, put a dollar figure on the yearly gap, check how your bids are built, and go over your three most important next steps on a 45-minute call with Jenn. Results in 5 business days, and the $950 counts toward the INSPECTION if you go further."));
    var br = el("div", { class: "btn-row" });
    br.appendChild(el("a", { class: "btn", href: BOOK, target: "_blank", rel: "noopener" }, "Book a free call to get started"));
    br.appendChild(el("a", { class: "btn btn-ghost", href: "/#overhead-check" }, "What's in the Overhead Check"));
    next.appendChild(br);
    card.appendChild(next);

    var again = el("button", { type: "button", class: "linkbtn", style: "margin-top:18px" }, "Take the test again");
    again.addEventListener("click", function () {
      answers = new Array(QUESTIONS.length); at = 0; card.className = "card"; showQuestion();
    });
    card.appendChild(again);
    card.appendChild(el("p", { class: "small-print" }, "The Profit Slump Test is a quick self-check from your own answers. It is not a review of your books or advice about your business, and its dollar figures are arithmetic, not a promise of results."));

    document.getElementById("quiz-area").scrollIntoView({ behavior: "smooth", block: "start" });
    lvl.focus({ preventScroll: true });
  }

  showQuestion();
})();
