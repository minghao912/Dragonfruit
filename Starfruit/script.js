const db = firebase.firestore();

function writeGreeting() {
  db.collection('greetingData').doc('firstGreeting').set({
      greeting: 'Kyle is a big bot.'
  })
  .then(function() {
      console.log('greeting written');
  })
  .catch(function(error) {
      console.error('Error adding document: ', error);
  });
}

function readGreeting() {
  let element = document.getElementById('results');
  element.innerHTML = '  ';
  db.collection('greetingData').get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        const data = doc.data();

        element.appendChild(document.createElement("br"));

        let resultDiv = document.createElement("div");
        resultDiv.setAttribute("class", "resultString");

        let centeredText = document.createElement("p");
        centeredText.align = "center";
        centeredText.appendChild(document.createTextNode(data.greeting));

        resultDiv.appendChild(centeredText);
        element.appendChild(resultDiv);

        //element.appendChild(document.createTextNode(data.greeting));
      });
    });
}
