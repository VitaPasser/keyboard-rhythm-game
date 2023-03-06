"use strict";

async function main(map = undefined) {
    let paternMap = map;
    
    if(map == undefined){
        const response = await fetch("../maps/1/firstpatern.json");
        paternMap = await response.json();
        paternMap.path_to_music = "../maps/" + paternMap.path_to_music;
        paternMap.path_to_background = "../maps/" + paternMap.path_to_background;
    } else {
        if(map.path_to_music.indexOf("https://drive.google.com") != -1) {
            var res = map.path_to_music.match(/https:\/\/drive.google.com\/file\/d\/([a-zA-Z0-9_]+)\//)
 
            var googleDriveFileID = res[1];
            map.path_to_music = "https://docs.google.com/uc?export=open&id=" + googleDriveFileID;
        }
    }

    console.log(paternMap);

    class Player {
        constructor(score_max) {
            this.score = score_max;
            this.can_max_score = score_max;
        }

        get_score() {
            return this.score
        }

        set_score(score) {
            this.score = score;
        }
    }
    let player = new Player(0);

    class OutputLiteral{
        constructor(id){
            this.id = id;
            this.take_point_on_click_now = 0;
            this.key_id = 0;
            this.is_end_exist_literal = 0;
            this.literal = 0; 
            this.audio = 0;
        }

    }

    class KeyboardInput {
        static key_id = "";
        static is_key_press = false;

        static turn_on_press = [];

        static to_add_turn_on_press(id) {
            this.turn_on_press.push(id);
        }

        static to_remove_turn_on_press() {
            this.turn_on_press.shift();
        }

        static to_key_press(key_id) {
            this.key_id = key_id;
            this.is_key_press = true;
        }

        static to_key_unpress() {
            this.is_key_press = false;
        }

        static input() {
            document.addEventListener('keydown', function(event) {
                KeyboardInput.to_key_press(event.code);
                let listener = KeyboardInput.turn_on_press[0];
                if(KeyboardInput.turn_on_press.length == 0) player.set_score(player.get_score() - paternMap.patern[0].key_get_score_for_press.other.take_away_points);
                if((KeyboardInput.key_id == listener.key_id)) {
                    KeyboardInput.key_id = 0;
                    player.set_score(player.get_score() - listener.take_point_on_click_now);
                    outputEndLiteral(listener.literal, listener.id, listener.is_end_exist_literal, listener.audio);
                } else if((KeyboardInput.key_id != listener.key_id) && KeyboardInput.key_id != 0) {
                    KeyboardInput.key_id = 0;
                    player.set_score(player.get_score() - paternMap.patern[0].key_get_score_for_press.other.take_away_points);
                    outputEndLiteral(listener.literal, listener.id, listener.is_end_exist_literal, listener.audio);
                }
                outputScore();
            });
            document.addEventListener('keyup', function(event) {
                KeyboardInput.to_key_unpress();
            });

        }
    }

    class isEndExistLiteral {
        constructor() {
            this.is_end_exist = false;
        }
    }

    function outputScore() {
        document.getElementById("score").innerHTML = player.get_score() + " - " + (player.get_score() / (player.can_max_score) * 100).toFixed(2) + "%";
    }


    function outputLiteral(literal, id, point, not_point, up_or_down, procent_opacity, is_end_exist_literal, audio, eventListener) {
        outputScore();
        setTimeout((literal, id)=>{
            if(!is_end_exist_literal.is_end_exist) {
                document.getElementById(id).style.opacity = procent_opacity;
                eventListener.key_id = literal.key_id;
                eventListener.take_point_on_click_now = point.take_away_points;
                eventListener.is_end_exist_literal = is_end_exist_literal;
                eventListener.literal = literal;
                eventListener.audio = audio;
                /*
                if((KeyboardInput.key_id == literal.key_id) && KeyboardInput.turn_on_press[0] == id) {
                    KeyboardInput.key_id = 0;
                    player.set_score(player.get_score() - point.take_away_points);
                    outputEndLiteral(literal, id, is_end_exist_literal, audio);
                } else if((KeyboardInput.key_id != literal.key_id) && KeyboardInput.key_id != 0 && KeyboardInput.turn_on_press[0] == id) {
                    player.set_score(player.get_score() - not_point.take_away_points);
                    outputEndLiteral(literal, id, is_end_exist_literal, audio);
                }
                */
            }

        }, point.score_diapasone[up_or_down].min, literal, id);
        
    }

    function outputLiteralOpaciting(literal, id, is_end_exist_literal, audio) {
        let time_to_action = literal.key_get_score_for_press;

        let eventListener = new OutputLiteral(id);
        KeyboardInput.to_add_turn_on_press(eventListener);
        outputLiteral(literal, id, time_to_action.p50, time_to_action.other, 0, "33%", is_end_exist_literal, audio, eventListener);
        outputLiteral(literal, id, time_to_action.p100, time_to_action.other, 0, "66%", is_end_exist_literal, audio, eventListener);
        outputLiteral(literal, id, time_to_action.p300, time_to_action.other, 0, "100%", is_end_exist_literal, audio, eventListener);
        outputLiteral(literal, id, time_to_action.p100, time_to_action.other, 1, "66%", is_end_exist_literal, audio, eventListener);
        outputLiteral(literal, id, time_to_action.p50, time_to_action.other, 1, "33%", is_end_exist_literal, audio, eventListener);
        
        setTimeout(() => {
            if(!is_end_exist_literal.is_end_exist) {
                player.set_score(player.get_score() - time_to_action.other.take_away_points);
                outputEndLiteral(literal, id, is_end_exist_literal, audio);
            }
        }, time_to_action.other.score_diapasone[0].min);
        //if(!isEndExistLiteral.is_end_exist) outputLiteral(literal, id, time_to_action.other, time_to_action.other, 0, "0%")
    }

    function outputStartLiteral(literal, id, audio) {
        let is_end_exist_literal = new isEndExistLiteral();

        const literal_element = document.createElement("div");
        literal_element.id = id;

        let printLiteral;
        if (typeof literal.literal_id === 'number') { printLiteral = String.fromCharCode(literal.literal_id);} 
        else { printLiteral = literal.literal_id}

        const node = document.createTextNode(printLiteral);
        

        literal_element.appendChild(node);
        
        const div_output = document.getElementById("output");
        div_output.appendChild(literal_element);
        
        player.set_score( player.get_score() + 300 );
        player.can_max_score += 300; 
        outputLiteralOpaciting(literal, id, is_end_exist_literal, audio);

        //if(!isEndExistLiteral.is_end_exist) setTimeout(outputEndLiteral, literal.key_time_live, literal, id);
    }

    function outputEndLiteral(literal, id, is_end_exist_literal, audio) {
        const literal_element = document.getElementById(id);
        is_end_exist_literal.is_end_exist = true;

        literal_element.remove();
        KeyboardInput.to_remove_turn_on_press();
        outputScore()
        if((paternMap.patern.length - 1) == id) audio.pause();
    }

    function firstOutputScore() {
        player.score = 0;
        player.can_max_score = 1;
        outputScore();
        player.score = 0;
        player.can_max_score = 0;
    }

    function game(audio){
        document.getElementById("title_div").style.display = "none";
        firstOutputScore();
        audio.play();
        document.getElementById("output").innerHTML = "";
        let to_start_time = 0;
        for (let id = 0; id < paternMap.patern.length; id++) {
            let literal = paternMap.patern[id];

            to_start_time += literal.key_to_appear_after_last_key;

            setTimeout(outputStartLiteral, to_start_time, literal, id, audio);
        }
    }

    function pregame(){
        KeyboardInput.input();


        const title_div_element = document.createElement("div");
        title_div_element.id = "title_div";
        title_div_element.className = "title_div";

        const description_element = document.createElement("p");
        description_element.id = "title";
        description_element.className = "title";

        const node_description_element = document.createTextNode("You are on your way to...");

        description_element.appendChild(node_description_element);
        
        const title_element = document.createElement("h2");
        title_element.id = "title";
        title_element.className = "title";

        const node_title = document.createTextNode(paternMap.map_name);

        title_element.appendChild(node_title);

        const author_map_element = document.createElement("p");
        author_map_element.id = "author_map";
        author_map_element.className = "author_map";

        const node_author_map = document.createTextNode("Author map: " + paternMap.author_map);

        author_map_element.appendChild(node_author_map);

        const author_music_element = document.createElement("p");
        author_music_element.id = "author_music";
        author_music_element.className = "author_music";

        const node_author_music = document.createTextNode("Author music: " + paternMap.author_music);

        author_music_element.appendChild(node_author_music);

        title_div_element.appendChild(description_element);
        title_div_element.appendChild(title_element);
        title_div_element.appendChild(author_map_element);
        title_div_element.appendChild(author_music_element);
        
        const div_game__process = document.getElementById("game__process");
        div_game__process.appendChild(title_div_element);

        const div_output = document.getElementById("output");

        document.getElementById("game").style.backgroundImage = `url("` + paternMap.path_to_background + `")`;
        
        let audio = new Audio(paternMap.path_to_music);
        setTimeout(game, 10000, audio);
    }

    pregame();

}

class MapJson{
    static map_json;
}

function loadFile() {
    var input, file, fr;

    if (typeof window.FileReader !== 'function') {
      alert("The file API isn't supported on this browser yet.");
      return;
    }

    input = document.getElementById('fileinput');
    if (!input) {
      alert("Um, couldn't find the fileinput element.");
    }
    else if (!input.files) {
      alert("This browser doesn't seem to support the 'files' property of file inputs.");
    }
    else if (!input.files[0]) {
      alert("Please select a file before clicking 'Load'");
    }
    else {
      file = input.files[0];
      fr = new FileReader();
      fr.onload = receivedText;
      fr.readAsText(file);
    }

    function receivedText(e) {
      let lines = e.target.result;
      var newArr = JSON.parse(lines); 
      MapJson.map_json = newArr;
    }
  }

function startgame(){
    //document.getElementById("btn").style.display = "none";
    document.getElementById("main_menu").style.display = "none";
    console.log(MapJson.map_json);
    main(MapJson.map_json).then();
}
