const messages = {
  "-whistle": " 'Vergiss nicht, warum du dieses Projekt liebst. -E'",
  "-says": " 'Eine Sache fertig ist besser als zehn angefangen. -E'",
  "-reminds": "Reminder: 'Atmen. Trinken. Pause. -E'",
  "-request": "Request: 'Was ist dein heutiges Highlight? -E'",
  "-motivates": "You can Do it: 'Der erste Commit ist der schwerste. -E'"
};

const hour = new Date().getHours();
let greeting = "Guten Tag";
if (hour < 6) greeting = "Gute Nacht";
else if (hour < 12) greeting = "Guten Morgen";
else if (hour < 18) greeting = "Hey Sonja";
else greeting = "Guten Abend";

// ✅ Node oder Browser erkennen
const isNode =
  typeof process !== "undefined" &&
  process?.argv &&
  typeof window === "undefined";

let arg = null;

if (isNode) {
  arg = process.argv[2];
} else {
  // Browser: ?elliot=-whistle
  const params = new URLSearchParams(window.location.search);
  arg = params.get("elliot");
}

if (!arg || !messages[arg]) {
  console.log(`
✨ ${greeting}! ✨

Elliot wartet auf ein Keyword:
  -whistle
  -says
  -reminds
  -request
  -motivates
`);

  // ✅ process.exit nur in Node
  if (isNode) process.exit(0);
} else {
  console.log(`\n✨ ${greeting}! ✨`);
  console.log(messages[arg]);
  console.log("---\n");
}



// node elliot.js -whistle
// node elliot.js -says
// node elliot.js -reminds
// node elliot.js -request
// node elliot.js -motivates

// function elliot { node .\elliot.js @args }

//  elliot -whistle
//  elliot -says
//  elliot -reminds
//  elliot -request
//  elliot -motivates

// node .\elliot.js -whistle
// node .\elliot.js -says
// node .\elliot.js -reminds
// node .\elliot.js -request
// node .\elliot.js -motivates
