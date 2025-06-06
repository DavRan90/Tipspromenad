document.getElementById("findme").addEventListener("click", geoFindMe)
document.getElementById("quit").addEventListener("click", quit)
document.getElementById("prevQuestion").addEventListener("click", prevQuestion)
document.getElementById("nextQuestion").addEventListener("click", nextQuestion)

const url = "https://opentdb.com/api.php?amount=10&category=12&difficulty=medium&type=multiple"
const quiz = document.getElementById("quiz")
const qFound = document.getElementById("q")
const aCorr = document.getElementById("a")
const currentQuestion = document.getElementById("currentQ")
const distanceToNextQuestion = document.getElementById("distanceToNext")
const directionToNextQuestion = document.getElementById("directionToNext")
const currentPosition = document.getElementById("currentPos")
const targetPosition = document.getElementById("targetPos")

let questionCount = 0
let correctAnswers = 0
let questionNr = 0

const pos0 = {name: "Fråga 1", lat: 59.104757, lon: 17.511706}
const pos1 = {name: "Fråga 2", lat: 59.104665, lon: 17.515297}
const pos2 = {name: "Fråga 3", lat: 59.103868, lon: 17.519358}
const pos3 = {name: "Fråga 4", lat: 59.102370, lon: 17.521541}
const pos4 = {name: "Fråga 5", lat: 59.101276, lon: 17.525028}
const pos5 = {name: "Fråga 6", lat: 59.099869, lon: 17.524154}
const pos6 = {name: "Fråga 7", lat: 59.097568, lon: 17.516638}
const pos7 = {name: "Fråga 8", lat: 59.097244, lon: 17.505222}
const pos8 = {name: "Fråga 9", lat: 59.100203, lon: 17.505191}
const pos9 = {name: "Fråga 10", lat: 59.105091, lon: 17.509434}


const positions = [pos0, pos1, pos2, pos3, pos4, pos5, pos6, pos7, pos8, pos9]

let results = []

myInterval = setInterval(geoFindMe, 5000)



fetch(url)
    .then(response => {
        if (!response != 0) {
        throw new Error('Error');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        return data.results
    })
    .then(query => {
        results = query
        console.log(results)
    }) 
    .catch(function(error){
        console.log("Något gick fel: " + error)
    })

function createQuestion(index)
{
    questionNr++
    q = results[index]
        console.log(q)
        let card = document.createElement("div")
        card.setAttribute("class", "qForm")

        let title = document.createElement("h3")
        title.setAttribute("class", "title")
        title.innerHTML = "Quiz Game"

        let img = document.createElement("img")
        img.src = "images/questionmark.jpg"

        let quizTitle = document.createElement("h3")
        quizTitle.setAttribute("class", "qTitle")
        quizTitle.innerHTML = "Question " + (index + 1)

        let question = document.createElement("p")
        question.setAttribute("class", "question")
        question.innerHTML = q.question

        let answers = document.createElement("div")
        answers.setAttribute("class", "answers")

        let questAnswers = [q.correct_answer, q.incorrect_answers[0], q.incorrect_answers[1], q.incorrect_answers[2]]
        console.log(questAnswers)

        for (let i = 0; i < 4; i++)
            {
                let rand = Math.floor(Math.random() * questAnswers.length);
                let inputButton = document.createElement("input")
                inputButton.setAttribute("type", "button")
                inputButton.setAttribute("value", questAnswers[rand])
                inputButton.setAttribute("id", i)
                if(questAnswers[rand] == q.correct_answer)
                {
                    inputButton.setAttribute("onclick", "answer(true, " + i + ")")
                }
                else
                {
                    inputButton.setAttribute("onclick", "answer(false, " + i + ")")
                }
                answers.appendChild(inputButton)
                questAnswers.splice(rand, 1)
            }

        card.appendChild(title)
        card.appendChild(img)
        card.appendChild(quizTitle)
        card.appendChild(question)

        card.appendChild(answers)
    
        quiz.appendChild(card)
}
function delQForm()
{
    quiz.removeChild(quiz.firstElementChild)
}

function answer(outcome, index)
        {
            myInterval = setInterval(geoFindMe, 5000)
            console.log(outcome)
            if(outcome == true)
            {
                let selected = document.getElementById(index)
                selected.setAttribute("class", "right")
                console.log("Correct")
                correctAnswers++
                aCorr.innerHTML = "Correct answers: " + correctAnswers
                setTimeout(delQForm, 2000) 
                
            }
            else
            {
                let selected = document.getElementById(index)
                selected.setAttribute("class", "wrong")
                console.log("Wrong")
                setTimeout(delQForm, 2000) 
            }
        }       

function geoFindMe()
{
    currentQuest()
    if(!navigator.geolocation)
    {
        alert("Du har ingen GPS-funktion")
    }
    else
    {
        console.log("Comparing GPS-position")
        navigator.geolocation.getCurrentPosition(funkar, fel)
    }

    function funkar(position)
    {
        let latitude = position.coords.latitude;
        let longitude  = position.coords.longitude;
        console.log("lat: " + latitude)
        console.log("lon: " + longitude)
        currentPosition.innerHTML = "Current:<br>Lat: " + latitude + "<br>Lon: " + longitude
        targetPosition.innerHTML = "Target:<br>Lat: " + positions[questionNr].lat + "<br>Lon: " + positions[questionNr].lon

        let accuracy = position.coords.accuracy;

        let distance = getDistance(latitude, longitude, positions[questionNr].lat, positions[questionNr].lon, "K")
        let minDiff = 0.000100
        if(distance < 0.09 && results[questionNr].type != "Shown")
        {
            openStreetMap(positions[questionNr].lat, positions[questionNr].lon)
            clearInterval(myInterval)
            questionCount++
            qFound.innerHTML = "Questions found: " + questionCount
            console.log("Creating question")
            results[questionNr].type = "Shown"
            let minDiff = 0.000100
            if(questionNr+1 < positions.length)
            {
                let distToNext = getDistance(latitude, longitude, positions[questionNr+1].lat, positions[questionNr+1].lon, "K")
                distanceToNextQuestion.innerHTML = "Distance to next question: " + distToNext.toFixed(2) + "km"

                let direction = ""
                
                if(longitude < positions[questionNr+1].lon && (longitude - positions[questionNr+1].lon) > minDiff)
                {
                    direction += "North "
                }
                else if(longitude > positions[questionNr+1].lon && (positions[questionNr+1].lon - longitude) > minDiff)
                {
                    direction += "South "
                }
                if(latitude > positions[questionNr+1].lat && (latitude - positions[questionNr+1].lat) > minDiff)
                    {
                        direction += "West "
                    }
                    else if(latitude < positions[questionNr+1].lat && (positions[questionNr+1].lat - latitude) > minDiff)
                    {
                        direction += "East "
                    }

                directionToNextQuestion.innerHTML = "Direction to next question is: " + direction
            }
            createQuestion(questionNr);        
        }
        else
        {
            openStreetMap(positions[questionNr].lat, positions[questionNr].lon)
            let distToNext = getDistance(latitude, longitude, positions[questionNr].lat, positions[questionNr].lon, "K")
            distanceToNextQuestion.innerHTML = "Distance to next question: " + distToNext.toFixed(2) + "km"
            let direction = ""
            
            if(latitude > positions[questionNr].lat)
            {
                direction += "South "
            }
            else if(latitude < positions[questionNr].lat)
            {
                direction += "North "
            }
            if(longitude < positions[questionNr].lon)
                {
                    direction += "East"
                }
                else if(longitude > positions[questionNr].lon)
                {
                    direction += "West"
                }

            directionToNextQuestion.innerHTML = "Direction to next question is: " + direction
        }
        
    }

    function fel(error)
    {
        alert(error)
    }

    function getDistance(lat1, lon1, lat2, lon2, unit) {
        var radlat1 = Math.PI * lat1 / 180
        var radlat2 = Math.PI * lat2 / 180
        var theta = lon1 - lon2
        var radtheta = Math.PI * theta / 180
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist)
        dist = dist * 180 / Math.PI
        dist = dist * 60 * 1.1515
        if (unit == "K") { dist = dist * 1.609344 }
        if (unit == "N") { dist = dist * 0.8684 }
        if (unit == "M") { dist = dist * 1609.344; dist = Math.round(dist) }
        console.log(dist)
        return dist
    }

    function openStreetMap(lat, long)
    {
        let latzoom = 0.01071819/2
        let longzoom = 0.020256042/2

        let marker = lat + "%2C" + long
        bbox = (long - longzoom) + "%2C" + (lat - latzoom) + "%2C" + (long + longzoom) + "%2C" + (lat + latzoom)

        let url = "https://www.openstreetmap.org/export/embed.html?bbox=" + bbox + "&layer=mapnik&marker=" + marker

        document.getElementById("map").src = url;
    }

}

function quit()
{
    clearInterval(myInterval)
    qFound.innerHTML = "You found " + questionCount + " out of " + results.length + " questions"
    aCorr.innerHTML = "You ended up getting " + correctAnswers + " correct answers"
    let playButton = document.getElementById("findme")
    playButton.setAttribute("class", "hidden")
}

function nextQuestion()
{
    if(questionNr < 9)
    {
        questionNr++
        geoFindMe()
    }
    
}

function prevQuestion()
{
    if(questionNr > 0)
        {
            questionNr--
            geoFindMe()
        }
}

function currentQuest()
{
    currentQuestion.innerHTML = "Looking for question number " + (questionNr + 1)
}