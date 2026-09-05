const fs = require('fs');
const path = require('path');

const engPath = path.join(__dirname, '../lib/feedbackData.ts');
const hinPath = path.join(__dirname, '../lib/feedbackDataHindi.ts');

function generateCombinations(subjects, actions, details, conclusions) {
  const phrases = [];
  for (const s of subjects) {
    for (const a of actions) {
      for (const d of details) {
        for (const c of conclusions) {
          phrases.push(`${s} ${a} ${d} ${c}`.trim().replace(/\s+/g, ' '));
        }
      }
    }
  }
  return phrases;
}

// ENGLISH PHRASES
const engPosEvent = generateCombinations(
  ["I hosted an event here", "I was a guest at a corporate event here", "My uncle's function was held here", "We organized a family event here", "My friend's party was hosted here"],
  ["and everything was beautifully organized.", "and the entire system was well-managed.", "and it was a magical experience.", "and the setup was flawless."],
  ["The catering provided by the hotel was excellent.", "The in-house catering was absolutely delicious.", "The food provided by the hotel catering team was fantastic.", "The hotel's catering service was top-notch."],
  ["Highly recommended!", "It was an unforgettable experience.", "Loved every moment.", "10/10 would book again.", "Absolutely fantastic."]
); 

const engNegEvent = generateCombinations(
  ["I attended a corporate event here", "We organized a family function at this venue", "My cousin's function took place here", "I hosted an event here", "I was a guest at an event here"],
  ["and the management was quite chaotic.", "and the setup was completely disorganized.", "and the coordination was chaotic.", "and the management was terrible."],
  ["Also, the hotel's catering service was very slow and disappointing.", "The in-house catering left much to be desired.", "The catering provided by the hotel was quite poor.", "The food provided by the hotel was underwhelming."],
  ["We were quite disappointed.", "Would not recommend.", "Needs serious improvement.", "It ruined the mood.", "Very frustrating experience."]
); 

const engPosMarriage = generateCombinations(
  ["I was a guest at a wedding here", "We hosted our marriage function at this venue", "My brother's wedding was held here", "My sister's wedding took place here", "My son's marriage was hosted here"],
  ["and everything was beautifully organized, with stunning decorations.", "and the arrangements were flawless, with such a beautiful setup.", "and the entire system was well-managed.", "and it was a magical experience."],
  ["The catering provided by the hotel was absolutely delicious!", "The in-house catering was flawless.", "The food provided by the hotel catering team was fantastic.", "The hotel's catering was exceptional."],
  ["Highly recommended!", "It was an unforgettable experience.", "Loved it.", "A perfect day.", "Will cherish the memories."]
); 

const engNegMarriage = generateCombinations(
  ["I attended a wedding here", "We hosted our marriage here", "My cousin's wedding took place here", "My brother's marriage was held here", "I was a guest at a marriage function here"],
  ["and the arrangements were unfortunately quite disorganized.", "and the management was quite chaotic.", "and the setup was completely disorganized.", "and the coordination was poor."],
  ["The in-house catering left much to be desired.", "Also, the hotel's catering service was very slow and disappointing.", "The catering provided by the hotel was subpar.", "The food provided by the hotel was a letdown."],
  ["We were quite disappointed.", "Would not recommend.", "Needs a lot of work.", "Very frustrating.", "Ruined the special day."]
);

// HINDI PHRASES
const hinPosEvent = generateCombinations(
  ["मैंने यहाँ एक इवेंट होस्ट किया था", "मैं यहाँ एक कॉर्पोरेट इवेंट में मेहमान था", "मेरे चाचा का फंक्शन यहीं हुआ था", "हमने यहाँ एक पारिवारिक कार्यक्रम आयोजित किया था", "मेरे दोस्त की पार्टी यहीं हुई थी"],
  ["और सब कुछ बहुत अच्छे से व्यवस्थित था।", "और पूरी व्यवस्था बहुत शानदार थी।", "और यह अनुभव बहुत जादुई रहा।", "और सेटअप बिल्कुल परफेक्ट था।"],
  ["होटल द्वारा दी गई कैटरिंग बहुत ही बेहतरीन थी।", "इन-हाउस कैटरिंग बहुत ही स्वादिष्ट थी।", "होटल की कैटरिंग टीम द्वारा दिया गया खाना शानदार था।", "होटल की कैटरिंग सर्विस लाजवाब थी।"],
  ["मैं सबको इसकी सलाह दूंगा!", "यह एक न भूलने वाला अनुभव था।", "हर पल बहुत अच्छा लगा।", "10/10!", "बिल्कुल शानदार।"]
);

const hinNegEvent = generateCombinations(
  ["मैं यहाँ एक कॉर्पोरेट इवेंट में गया था", "हमने यहाँ एक पारिवारिक फंक्शन आयोजित किया था", "मेरे कजिन का फंक्शन यहीं हुआ था", "मैंने यहाँ एक इवेंट होस्ट किया था", "मैं यहाँ एक इवेंट में मेहमान था"],
  ["और मैनेजमेंट काफी खराब था।", "और सेटअप पूरी तरह से अव्यवस्थित था।", "और कोई भी समन्वय नहीं था।", "और व्यवस्था बहुत बेकार थी।"],
  ["साथ ही, होटल की कैटरिंग सर्विस बहुत धीमी और निराशाजनक थी।", "इन-हाउस कैटरिंग बिल्कुल भी अच्छी नहीं थी।", "होटल द्वारा दी गई कैटरिंग काफी खराब थी।", "होटल का खाना बहुत ही साधारण था।"],
  ["हम काफी निराश हुए।", "मैं इसकी सलाह नहीं दूंगा।", "इन्हें सुधार की बहुत जरूरत है।", "मूड खराब हो गया।", "बहुत ही निराशाजनक अनुभव।"]
);

const hinPosMarriage = generateCombinations(
  ["मैं यहाँ एक शादी में मेहमान था", "हमारी शादी का फंक्शन यहीं हुआ था", "मेरे भाई की शादी यहीं हुई थी", "मेरी बहन की शादी यहाँ हुई थी", "मेरे बेटे की शादी यहाँ हुई थी"],
  ["और सब कुछ पूरी तरह से व्यवस्थित था, डेकोरेशन भी बहुत अच्छी थी।", "और व्यवस्था बेहतरीन थी, मंडप भी बहुत सुंदर था।", "और पूरा सिस्टम अच्छे से मैनेज किया गया था।", "और अनुभव बहुत शानदार रहा।"],
  ["होटल द्वारा दी गई कैटरिंग बहुत ही स्वादिष्ट थी!", "होटल की कैटरिंग और सजावट बेहतरीन थी।", "होटल की कैटरिंग टीम द्वारा दिया गया खाना शानदार था।", "होटल की कैटरिंग लाजवाब थी।"],
  ["मैं सबको इसकी सलाह दूंगा!", "यह बहुत ही शानदार था।", "मज़ा आ गया!", "एकदम परफेक्ट दिन।", "यादें हमेशा ताज़ा रहेंगी।"]
);

const hinNegMarriage = generateCombinations(
  ["मैं यहाँ एक शादी में गया था", "हमारी शादी यहीं हुई थी", "मेरे कजिन की शादी यहाँ हुई थी", "मेरे भाई की शादी यहीं हुई थी", "मैं यहाँ एक शादी समारोह में मेहमान था"],
  ["और दुर्भाग्य से व्यवस्था काफी खराब थी।", "और मैनेजमेंट काफी अव्यवस्थित था।", "और सेटअप पूरी तरह से अव्यवस्थित था।", "और कोई भी समन्वय नहीं था।"],
  ["इन-हाउस कैटरिंग बिल्कुल भी अच्छी नहीं थी।", "साथ ही, होटल की कैटरिंग सर्विस बहुत धीमी और निराशाजनक थी।", "होटल द्वारा दी गई कैटरिंग काफी खराब थी।", "होटल का खाना बहुत ही साधारण था।"],
  ["हम काफी निराश हुए।", "मैं इसकी सलाह नहीं दूंगा।", "बहुत सारा सुधार चाहिए।", "बहुत निराशा हुई।", "इस खास दिन का मज़ा किरकिरा हो गया।"]
);

// Helper function to pick 150 random items
function getRandom(arr, n) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

const finalEngPosEvent = getRandom(engPosEvent, 150);
const finalEngNegEvent = getRandom(engNegEvent, 150);
const finalEngPosMarriage = getRandom(engPosMarriage, 150);
const finalEngNegMarriage = getRandom(engNegMarriage, 150);

const finalHinPosEvent = getRandom(hinPosEvent, 150);
const finalHinNegEvent = getRandom(hinNegEvent, 150);
const finalHinPosMarriage = getRandom(hinPosMarriage, 150);
const finalHinNegMarriage = getRandom(hinNegMarriage, 150);

function formatArrayForTs(arr) {
  return "[\n      " + arr.map(s => '"' + s.replace(/"/g, '\\"') + '"').join(",\n      ") + "\n    ]";
}

function injectPhrases(filePath, posEvent, negEvent, posMarriage, negMarriage) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Inject into positive
  const posEventStr = '"Event": ' + formatArrayForTs(posEvent) + ',\n    "Marriage": ' + formatArrayForTs(posMarriage) + ',\n    "Serving":';
  content = content.replace(/"Serving":/, posEventStr);
  
  // Inject into negative
  const negRegex = /("negative"\s*:\s*\{\s*)"Serving"\s*:/;
  const match = content.match(negRegex);
  if (match) {
    const negEventStr = match[1] + '"Event": ' + formatArrayForTs(negEvent) + ',\n    "Marriage": ' + formatArrayForTs(negMarriage) + ',\n    "Serving":';
    content = content.replace(negRegex, negEventStr);
  } else {
    console.log("Could not find negative section in", filePath);
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated ' + filePath);
}

injectPhrases(engPath, finalEngPosEvent, finalEngNegEvent, finalEngPosMarriage, finalEngNegMarriage);
injectPhrases(hinPath, finalHinPosEvent, finalHinNegEvent, finalHinPosMarriage, finalHinNegMarriage);
