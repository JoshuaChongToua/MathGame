import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useState, useEffect, useRef } from "react";

const randomNumber = (max) => Math.floor(Math.random() * max);

export default function App() {
  // État pour définir les limites des nombres aléatoires
  const [maxNumber, setMaxNumber] = useState(50);
  const [numberOne, setNumberOne] = useState(() => randomNumber(50));
  const [numberTwo, setNumberTwo] = useState(() => randomNumber(50));
  const [maxTime, setMaxTime] = useState(15); // Temps maximum pour chaque partie
  const [timeLeft, setTimeLeft] = useState(maxTime); // Temps restant
  const [solution, setSolution] = useState(numberOne + numberTwo); // Solution
  const [userAnswer, setUserAnswer] = useState(""); // Réponse de l'utilisateur
  const [msg, setMsg] = useState(""); // Message
  const [difficulty, setDifficulty] = useState(null); // Difficulté sélectionnée

  const [buttonEnabled, setButtonEnabled] = useState(true); // Activation du bouton "Submit"
  const [buttonNewGame, setButtonNewGame] = useState(false); // Activation du bouton "New Game"

  const timerRef = useRef(null); // Référence pour le timer

  // Diminue le temps restant chaque seconde
  const decreaseTime = () => {
    setTimeLeft((time) => Math.max(time - 1, 0));
  };

  // Démarre un nouveau timer
  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(decreaseTime, 1000);
  };

  // Arrête le jeu et affiche un message si le temps est écoulé
  useEffect(() => {
    if (timeLeft === 0) {
      clearInterval(timerRef.current);
      setButtonEnabled(false);
      setMsg("Temps écoulé, la réponse était : " + solution);
      setButtonNewGame(true);
    }
  }, [timeLeft]);

  // Recalcule la solution quand les nombres changent
  useEffect(() => {
    setSolution(numberOne + numberTwo);
  }, [numberOne, numberTwo]);

  // Réinitialise le temps quand la limite de temps change
  useEffect(() => {
    setTimeLeft(maxTime);
  }, [maxTime]);

  // Recalcule les nombres aléatoires quand la difficulté change
  useEffect(() => {
    if (maxNumber) {
      setNumberOne(randomNumber(maxNumber));
      setNumberTwo(randomNumber(maxNumber));
    }
  }, [maxNumber]);

  // Vérifie si la réponse de l'utilisateur est correcte
  const handleSubmit = () => {
    const userAnswerAsNumber = parseInt(userAnswer, 10);
    if (userAnswerAsNumber === solution) {
      setMsg("Bonne réponse !");
    } else {
      setMsg("Mauvaise réponse, la réponse était : " + solution);
    }
    setButtonEnabled(false);
    setButtonNewGame(true);
    clearInterval(timerRef.current);
  };

  // Réinitialise le jeu avec de nouveaux nombres et un nouveau timer
  const newGame = () => {
    clearInterval(timerRef.current);
    setTimeLeft(maxTime);
    setMsg("");
    setButtonEnabled(true);
    setButtonNewGame(false);
    setUserAnswer("");
    setNumberOne(randomNumber(maxNumber));
    setNumberTwo(randomNumber(maxNumber));
    startTimer();
  };

  // Configure les paramètres du jeu en fonction de la difficulté sélectionnée
  const handleDifficultySelect = (value) => {
    clearInterval(timerRef.current);
    setDifficulty(value);
    setMaxTime(value);
    setTimeLeft(value);

    // Définir les limites des nombres et du temps en fonction de la difficulté
    if (value === 15) {
      setMaxNumber(50);
    }
    else if (value === 10) {
      setMaxNumber(100);
    }
    else {
      setMaxNumber(500);
    }

    startTimer();
  };

  // Réinitialise le jeu pour permettre de changer la difficulté
  const changeDifficulty = () => {
    clearInterval(timerRef.current);
    setDifficulty(null);
    setMsg("");
  };

  return (
      <View style={styles.container}>
        {difficulty === null ? (
            <View>
              <Text style={styles.text}>Choisissez une difficulté :</Text>
              <Button title="Facile (15s)" onPress={() => handleDifficultySelect(15)} />
              <Button title="Moyen (10s)" onPress={() => handleDifficultySelect(10)} />
              <Button title="Difficile (5s)" onPress={() => handleDifficultySelect(5)} />
            </View>
        ) : (
            <View>
              <Button title="Change Difficulty" onPress={changeDifficulty} />
              <Text style={styles.timer}>Timer : {timeLeft}</Text>
              <Text>
                {numberOne} + {numberTwo}
              </Text>
              <TextInput
                  style={styles.input}
                  placeholder="Enter your answer here"
                  keyboardType="numeric"
                  value={userAnswer}
                  onChangeText={setUserAnswer}
              />
              <View style={styles.buttonContainer}>
                <Button title="New Game" onPress={newGame} />
                <Button title="Submit" onPress={handleSubmit} disabled={!buttonEnabled} />
              </View>
              <Text>{msg}</Text>
            </View>
        )}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  text: {
    fontSize: 20,
    marginBottom: 10,
  },
  timer: {
    fontSize: 20,
    marginBottom: 10,
    color: "red"
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 18,
    marginVertical: 10,
    width: "80%",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 20,
  },
});
