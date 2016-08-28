<?php
	/**
	 * Tudo se resume a usar json_decode() e json_encode()
	 */
	if ($_SERVER["REQUEST_METHOD"] !== "POST") {
		exit();
	}
	if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)) {
		$_POST = json_decode(file_get_contents('php://input'), true);
	}

	/**
	 * $jsonAnswerRecord deve ser trazido antes de acessar fopen, senão parece que existe restrição de acesso
	 */
	$jsonAnswerRecord = json_decode(file_get_contents("assessmentData/userAnswers.json"), true);
	$dbFile = fopen ("assessmentData/userAnswers.json" , "w");
	$currentAssessment = null;

	if ($jsonAnswerRecord == null) {
		$jsonAnswerRecord = array();
	}

	/*----------------------------------------------------------------------
	 *	O código abaixo, inutilizado por enquanto, adicionaria organização ao arquivo da database.
	 *	Mas, como tudo funciona sem isso, deixei sem esse "toque" a mais de complexidade
	 */

			/**
			 * Encontrar a prova à qual $_POST pertence, dentre aquelas armazenadas em $jsonAnswerRecord
			 */
			/*
			$assessmentLocated = false;
			for ($i = 0 ; $i < count($jsonAnswerRecord) && !$assessmentLocated ; $i++) {
				if ($jsonAnswerRecord[$i]["assessmentId"] == $_POST["assessmentId"]) {
					$assessmentLocated = true;
					$currentAssessment = $jsonAnswerRecord[$i];
				}
			}
			echo ("currentAssessment: ----------------------------\n");
			echo (var_dump($currentAssessment));
			echo ("\n\n\n\n");
			*/


			/**
			 * Se não houver registro desta prova, criar o primeiro registro na raiz de $jsonAnswerRecord
			 */
			/*
			if ($currentAssessment == null) {
				array_push($jsonAnswerRecord, $_POST);
			}
			*/
			/**
			 * Se houver registro, colocar $_POST na seção correspondente a esta prova (identificada por $currentAssesment)
			 */
			/*
			else {
					echo ("POST: ----------------------------\n");
					echo (var_dump($_POST));
					echo ("\n\n\n\n");

				$currentAssessment[count($currentAssessment)] = $_POST;
			}

			echo ("currentAssessment: ----------------------------\n");
			echo (var_dump($currentAssessment));
			echo ("\n\n\n\n");
			*/

	array_push($jsonAnswerRecord, $_POST);
	$dataToWrite = json_encode($jsonAnswerRecord);

	echo (fwrite($dbFile, $dataToWrite));
	fclose($dbFile);
?>