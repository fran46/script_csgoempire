/* Script para csgoempire.com | Por fran_VR46 - comuesp.com */
var apostarAl = ""; 
var totalGanado = 0;
var rachaPerdidas = 0;
var apuestaBase = 1;
var modoJuego = "martingala+porcentaje"; //Elejir entre: "martingala" - "martingala+porcentaje" -  "aleatorio"
//El modo "martingala" siempre apostara al ultimo color qe ha salido...
//El modo "martingala+porcentaje" aportara al ultimo color que ha salido, excepto si en las ultimas 6 rondas no ha salido un color en concreto y apostara a ese color
//El modo "aleatorio" apostara a un numero aleatorio, generado con la funcion random() de JavaScript
var historico = []; 
var totalApuestaActual = 0;
var heApostado = false;
var ultimaApuesta = "";
clientData.socket.on('roll', function(data){
	//data contiene un objeto similar a: Object {winner: 14, timer: 30000, round: 978340, new_round: 978341}
	if(data.winner==0) {
		console.log("Ficha ganadora -> DATOS (num: "+data.winner+")");
	} else {
		if(data.winner<=7) {
			console.log("Ficha ganadora -> T (num: "+data.winner+")");
		} else {
			console.log("Ficha ganadora -> CT (num: "+data.winner+")");
		}
	}
	historico.unshift(data.winner); //añado el numero ganador al historico
	apostarAl = ultimoNumero(); //obtengo el numero al que voy a apostar en la proxima ronda
	setTimeout(function(){realizarApuesta(apostarAl)},9000); //a los 7 segundos (lo que tarda el rooll) envio la apuesta
});
function ultimoNumero() {
	//miro la longitud del historico. No apostare hasta qe tenga un historico de al menos 6 numeros:
	if(historico.length<=6) {
		//devuelvo vacio = no se apostara
		console.log("En esta ronda no se apostara. Almacenando "+historico.length+"/6 jugadas en historico");
		return "";
	} else {
		//Si ya he almacenado 6 numeros en el historico:
		//Obtengo el ultimo numero que ha salido
		var ultimoNumero = obtnerUltimoNumeroValido(0);
		console.log("Ultimo numero en salir (distinto de 0): "+ultimoNumero);
		//recorto el array a 6:
		historico.length = 6;
		console.log(historico);
		return ultimoNumero;
	}
}
function realizarApuesta(numero) {
	if(numero == "") {
		console.log("Ronda saltada sin apostar");
	} else {
		totalApuestaActual = obtenerCantidadApostar();
		console.log("Apostare la cantidad de: "+totalApuestaActual+" coins");
		
		//En funcion del modo de juego...
		switch(modoJuego) {
			case "martingala":
				//Salgo directamente, ya que postare al ultimo numero en salir
				break;
			case "martingala+porcentaje":
				//recorro el array
				var ct = false;
				var t = false;
				for(aux in historico) {
					if(historico[aux]!=0) {
						if(historico[aux]<=7) {
							t = true;
						} else {
							ct = true;
						}
					}
				}
				if(!ct) {
					//Si no ha salido ningun numero correspondiente a CT, apostare a CT
					numero = 10;
					console.log("No ha saludido ningun CT en las ultimas 6 rondas, asi que apostaremos al CT");
				} else {
					if(!t) {
						//Si no ha salido ningun numero correspondiente a T, apostare a T
						numero = 5;
						console.log("No ha saludido ningun T en las ultimas 6 rondas, asi que apostaremos al T");
					}
				}
				break;
			case "aleatorio":
				//paso de todo los calculos anteriores y apuesto a un numero random...entre 1 y 14
				numero = Math.floor(Math.random() * (14 - 1)) + 1;
				break;
			default:
				break;
		}
		
		//Miro si el numero se corresponde a CT (del 8 al 14) o T (del 1 al 7)
		if(numero<=7) {
			//T
			console.log("Enviadno apuesta al: T");
			//GameClient.place_bet('t', totalApuestaActual);
			clientData.socket.emit("place bet", { round: clientData.round, coin: "t", amount: totalApuestaActual});
			heApostado = true;
			ultimaApuesta = "t";
		} else {
			//ct
			console.log("Enviando apuesta al: CT");
			//GameClient.place_bet('ct', totalApuestaActual);
			clientData.socket.emit("place bet", { round: clientData.round, coin: "ct", amount: totalApuestaActual});
			heApostado = true;
			ultimaApuesta = "ct";
		}
	}
}

function obtnerUltimoNumeroValido(start) {
	if(historico[start]!=0) {
		//si no es verde!
		return historico[start];
	} else {
		//si es verde, vuelvo a llamar a esta funcion. recursividad!
		obtnerUltimoNumeroValido(start+1);
	}
}

function obtenerCantidadApostar() {
	if(heApostado==true) {
		if(historico[0]==0) {
			//Si el ultimo numero en salir ha sido 0 he perfifo seguro...
			return totalApuestaActual*2;
		} else {
			if(historico[0]<=7) {
				if(ultimaApuesta=="t") {
					//significa que en la ultima apuesta acerte!
					return apuestaBase;
				} else {
					//perdi...
					return totalApuestaActual*2;
				}
			} else {
				if(historico[0]>=8) {
					if(ultimaApuesta=="ct") {
						//significa que en la ultima apuesta acerte!
						return apuestaBase;
					} else {
						//perdi...
						return totalApuestaActual*2;
					}
				}
			}
		}
	} else {
		return apuestaBase;
	}
}
