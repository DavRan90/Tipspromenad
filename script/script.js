document.getElementById("findme").addEventListener("click", geoFindMe)
document.getElementById("quit").addEventListener("click", quit)

const url = "https://opentdb.com/api.php?amount=10&category=12&difficulty=medium&type=multiple"
const quiz = document.getElementById("quiz")
const qFound = document.getElementById("q")
const aCorr = document.getElementById("a")
const distanceToNextQuestion = document.getElementById("distanceToNext")
const directionToNextQuestion = document.getElementById("directionToNext")

let questionCount = 0
let correctAnswers = 0

const pos0 = {name: "Fråga 1", lat: 59.104662, lon: 17.515126}
const pos1 = {name: "Fråga 2", lat: 59.104665, lon: 17.515297}
const pos2 = {name: "Fråga 3", lat: 59.103868, lon: 17.519358}
const pos3 = {name: "Fråga 4", lat: 59.102370, lon: 17.521541}
const pos4 = {name: "Fråga 5", lat: 59.101276, lon: 17.525028}
const pos5 = {name: "Fråga 6", lat: 59.099869, lon: 17.524154}
const pos6 = {name: "Fråga 7", lat: 59.097568, lon: 17.516638}
const pos7 = {name: "Fråga 8", lat: 59.097244, lon: 17.505222}
const pos8 = {name: "Fråga 9", lat: 59.06080, lon: 17.505209}
const pos9 = {name: "Fråga 10", lat: 59.100203, lon: 17.509289}


const positions = [pos0, pos1, pos2, pos3, pos4, pos5, pos6, pos7, pos8, pos9]

let results = []

setInterval(geoFindMe, 10000)


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
        let accuracy = position.coords.accuracy;

        

        for(let i = 0; i < positions.length; i++)
        {
            let distance = getDistance(latitude, longitude, positions[i].lat, positions[i].lon, "K")
            let minDiff = 0.000100
            if(distance < 0.005 && results[i].type != "Shown")
                {
                    openStreetMap(positions[i].lat, positions[i].lon)
                    clearInterval()
                    questionCount++
                    qFound.innerHTML = "Questions found: " + questionCount
                    console.log("Creating question")
                    results[i].type = "Shown"
                    let minDiff = 0.000100
                    if(i+1 < positions.length)
                        {
                            let distToNext = getDistance(latitude, longitude, positions[i+1].lat, positions[i+1].lon, "K")
                            distanceToNextQuestion.innerHTML = "Distance to next question: " + distToNext.toFixed(2) + "km"
                            
                            let direction = ""
                            if(longitude > positions[i+1].lon && (longitude - positions[i+1].lon) > minDiff)
                            {
                                direction += "South "
                            }
                            else if(longitude < positions[i+1].lon && (positions[i+1].lon - longitude) > minDiff)
                            {
                                direction += "North "
                            }
                            if(latitude > positions[i+1].lat && (latitude - positions[i+1].lat) > minDiff)
                                {
                                    direction += "West"
                                }
                                else if(latitude < positions[i+1].lat && (positions[i+1].lat - latitude) > minDiff)
                                {
                                    direction += "East"
                                }
                            directionToNextQuestion.innerHTML = "Direction to next question is: " + direction
                        }
                    createQuestion(i);
                    
                }
                else
                {
                    openStreetMap(latitude, longitude)
                    let distToNext = getDistance(latitude, longitude, positions[i].lat, positions[i].lon, "K")
                            distanceToNextQuestion.innerHTML = "Distance to next question: " + distToNext.toFixed(2) + "km"
                            let direction = ""
                            if(longitude > positions[i].lon && (longitude - positions[i].lon) > minDiff)
                            {
                                direction = "North "
                            }
                            else if(longitude < positions[i].lon && (positions[i].lon - longitude) > minDiff)
                            {
                                direction = "South "
                            }
                            if(latitude > positions[i].lat && (latitude - positions[i].lat) > minDiff)
                                {
                                    direction += "East"
                                }
                                else if(latitude < positions[i].lat && (positions[i].lat - latitude) > minDiff)
                                {
                                    direction += "West"
                                }
                            directionToNextQuestion.innerHTML = "Direction to next question is: " + direction
                }
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
    clearInterval()
    qFound.innerHTML = "You found " + questionCount + " out of " + results.length + " questions"
    aCorr.innerHTML = "You ended up getting " + correctAnswers + " correct answers"
    let playButton = document.getElementById("findme")
    playButton.setAttribute("class", "hidden")
}