const fs = require('fs');
const path = require('path');

const shuffle = (array) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

const generate = (subjects, verbs, adjectives, endings, max = 100) => {
  const combinations = [];
  for (const s of subjects) {
    for (const v of verbs) {
      for (const a of adjectives) {
        for (const e of endings) {
          combinations.push(`${s} ${v} ${a} ${e}`.trim());
        }
      }
    }
  }
  return shuffle(combinations).slice(0, max);
};

// ENGLISH
const enData = {
  positive: {
    'Serving': generate(
      ["Service", "The serving", "Table service", "Food delivery", "Waitstaff"],
      ["was", "is", "turned out to be", "ended up being"],
      ["super fast", "really quick", "on point", "awesome", "great", "amazing", "insanely fast", "super chill"],
      ["honestly.", "for sure.", "man, loved it.", "!", "seriously.", "and we didn't even wait."]
    ),
    'Staff Behaviour': generate(
      ["Staff", "The crew", "The team", "Everyone here", "Waiters"],
      ["were", "was", "seemed", "looked"],
      ["super chill", "really awesome", "super friendly", "so sweet", "really cool", "so welcoming", "super nice"],
      ["honestly.", "for sure.", "loved them.", "made my day.", "seriously.", "which was great."]
    ),
    'Cleaning': generate(
      ["The place", "Everything", "The tables", "The whole vibe", "Cleanliness"],
      ["was", "is", "looked", "felt"],
      ["spotless", "super clean", "so fresh", "squeaky clean", "super neat", "perfect", "insanely clean"],
      ["for sure.", "honestly.", "seriously.", "loved it.", "and really well-kept."]
    ),
    'Room Quality': generate(
      ["The room", "The space", "The vibe here", "Our room"],
      ["was", "is", "felt", "looked"],
      ["awesome", "super cozy", "super comfy", "really beautiful", "really chill", "great", "insane", "super clean"],
      ["for sure.", "honestly.", "10/10.", "seriously.", "loved it.", "and we slept great."]
    )
  },
  negative: {
    'Serving': generate(
      ["Service", "The serving", "Table service", "Food delivery", "Waitstaff"],
      ["was", "seemed", "turned out to be", "ended up being"],
      ["super slow", "really delayed", "kinda terrible", "a bit trash", "so frustrating", "way too slow", "really annoying"],
      ["honestly.", "for sure.", "not gonna lie.", "...", "which sucked.", "and ruined the mood."]
    ),
    'Staff Behaviour': generate(
      ["Staff", "The crew", "The team", "Everyone here", "Waiters"],
      ["were", "was", "seemed", "acted"],
      ["really rude", "kinda mean", "super unbothered", "not cool", "giving bad vibes", "super annoying", "so disrespectful"],
      ["honestly.", "for sure.", "not gonna lie.", "...", "which was awful.", "and ruined the mood."]
    ),
    'Cleaning': generate(
      ["The place", "Everything", "The tables", "The whole vibe", "Cleanliness"],
      ["was", "looked", "felt"],
      ["kinda gross", "super dirty", "really dusty", "super unhygienic", "trash", "really messy", "disgusting"],
      ["honestly.", "for sure.", "not gonna lie.", "...", "needs work.", "which is unacceptable."]
    ),
    'Room Quality': generate(
      ["The room", "The space", "The vibe here", "Our room"],
      ["was", "felt", "looked"],
      ["really cramped", "kinda beat up", "super uncomfortable", "not it", "giving motel vibes", "trash", "too small"],
      ["honestly.", "for sure.", "not gonna lie.", "...", "needs a fix.", "which was disappointing."]
    )
  }
};

// HINDI
const hiData = {
  positive: {
    'Serving': generate(
      ["Service", "Serving", "Waitstaff", "खाना आने की speed", "यहाँ की सर्विस"],
      ["थी", "लगी"],
      ["एकदम मस्त", "सुपर फ़ास्ट", "बहुत सही", "कमाल", "एकदम झकास", "टॉप क्लास", "बहुत बढ़िया"],
      ["कसम से।", "मज़ा आ गया।", "सच में।", "भाई मान गए।", "बिल्कुल झंझट नहीं।", "सीरियसली।"]
    ),
    'Staff Behaviour': generate(
      ["Staff", "टीम", "यहाँ के लोग", "सब लोग", "The crew"],
      [""],
      ["बहुत chill", "सुपर friendly", "एकदम बढ़िया", "मस्त", "बहुत sweet", "बहुत helping", "cool"],
      ["थे यार।", "लगे मुझे।", "मज़ा आ गया बात करके।", "सच में।", "honestly।", "for sure।"]
    ),
    'Cleaning': generate(
      ["जगह", "सब कुछ", "Tables", "यहाँ का माहौल"],
      [""],
      ["एकदम साफ", "बहुत clean", "चमकता हुआ", "सुपर neat", "बिल्कुल spotless", "बहुत fresh"],
      ["था।", "लगा।", "था सच में।", "था यार।", "था honestly।", "था for sure।"]
    ),
    'Room Quality': generate(
      ["Room", "हमारा रूम", "Space", "यहाँ का रूम"],
      [""],
      ["बहुत cozy", "एकदम luxury", "सुपर comfy", "बहुत chill", "कमाल", "बहुत सुंदर", "मस्त"],
      ["था।", "लगा मुझे।", "था सच में।", "था यार।", "था honestly।", "था 10/10।"]
    )
  },
  negative: {
    'Serving': generate(
      ["Service", "Serving", "Waitstaff", "खाना आने की speed", "यहाँ की सर्विस"],
      ["थी", "लगी"],
      ["बहुत slow", "एकदम बकवास", "महा लेट", "बहुत irritating", "फालतू", "कचरा", "बहुत delayed"],
      ["दिमाग खराब हो गया।", "मूड ऑफ़ हो गया।", "सच में बेकार।", "frustrating था बहुत।", "honestly.", "सीरियसली।"]
    ),
    'Staff Behaviour': generate(
      ["Staff", "टीम", "यहाँ के लोग", "सब लोग", "The crew"],
      [""],
      ["बहुत rude", "एकदम सड़ू", "बकवास", "अजीब", "बिना तमीज़ वाले", "बहुत mean", "unhelpful"],
      ["थे यार।", "लगे मुझे।", "मूड ख़राब कर दिया।", "सच में बेकार।", "honestly.", "सीरियसली।"]
    ),
    'Cleaning': generate(
      ["जगह", "सब कुछ", "Tables", "यहाँ का माहौल", "Cleanliness"],
      [""],
      ["काफी गंदी", "बहुत dirty", "धूल से भरी", "unhygienic", "बकवास", "बहुत gross"],
      ["थी।", "लगी मुझे।", "थी सच में।", "थी यार।", "थी honestly।", "थी सीरियसली।"]
    ),
    'Room Quality': generate(
      ["Room", "हमारा रूम", "Space", "यहाँ का रूम"],
      [""],
      ["बहुत छोटा", "एकदम बकवास", "बहुत uncomfortable", "बहुत अजीब", "ख़राब", "पुराना"],
      ["था।", "लगा मुझे।", "था सच में।", "था यार।", "था honestly।", "था सीरियसली।"]
    )
  }
};

const enContent = 'export const feedbackPhrases = ' + JSON.stringify(enData, null, 2) + ';';
const hiContent = 'export const feedbackPhrasesHindi = ' + JSON.stringify(hiData, null, 2) + ';';

fs.writeFileSync(path.join(__dirname, '../lib/feedbackData.ts'), enContent);
fs.writeFileSync(path.join(__dirname, '../lib/feedbackDataHindi.ts'), hiContent);

console.log('Successfully regenerated without heavy slang!');
