/* Script para csgoempire.com | Por fran_VR46 - comuesp.com */
e = document.createElement("div");
e.innerHTML = '<div style="position: absolute; z-index:999999; width: 100%;"><a onclick="mostrarTablaChat()">Ver</a>/<a onclick="ocultarTablaChat()">Ocultar</a><table id="tablaScript" style="background-color: #ccc; border: 1px solid black; color: black;"><tr><td style="padding: 3px;vertical-align: bottom;">Modo de juego:</td><td style="padding: 3px;vertical-align: bottom;">Apuesta base:</td><td style="padding: 3px;vertical-align: bottom;">Detener si la ganancia es igual o superior a:</td><td style="padding: 3px;vertical-align: bottom;">Detener si la apuesta va a ser igual o superior a:</td><td style="padding: 3px;vertical-align: middle;"><button onclick="iniciarScript()" id="buttonInicio" style="border-radius: 5px; background-color: #22894b;">Iniciar</button></td></tr><tr><td style="padding: 3px;vertical-align: top;"><select id="modo" style="height: 26px;border-radius: 5px;"><option value="martingala-mismo-porcentaje">Mismo color + Porcentaje</option><option value="martingala-op-porcentaje">Color opuesto + Porcentaje</option><option value="martingala-op">Color opuesto</option><option value="martingala-mismo">Mismo color</option><option value="modo-espera">Modo espera</option><option value="aleatorio">Aleatorio</option><option value="porcentaje">Porcentaje</option> </select></td><td style="padding: 3px;vertical-align: top;"><input type="number" id="apuestaBase" value="1" style="height: 26px;border-radius: 5px;"></td><td style="padding: 3px;vertical-align: top;"><input type="number" id="maxGanado" value="1000" style="height: 26px;border-radius: 5px;"></td><td style="padding: 3px;vertical-align: top;"><input type="number" id="apuestaMax" value="1000" style="height: 26px;border-radius: 5px;"></td><td style="padding: 3px;vertical-align: middle;"><button onclick="detenerScript()" style="border-radius: 5px; background-color: #a94442;">Detener</button></td></tr><tr><td style="padding: 3px;vertical-align: top;">Inicio ejecución Script: <span id="horaInicio"></span><br/> Total ganado: <span id="totalGanado"></span><br/> Perdidas: <span id="totalPerdido"></span><br/> Rondas jugadas: <span id="rondasJugadas"></span><br/><a href="#">Más info</span></td><td colspan="4" height="120px" style="background-color: black;color: #31ff00;padding: 3px; font-size: 9px; height:120px; max-height:120px;"><textarea style="border: none;height: 100px; width:100%; overflow-y: scroll;background-color: black;color: #31ff00;" id="consolaScript"></textarea></td></tr></table></div>';
document.body.insertBefore(e, document.body.childNodes[2]);
function ocultarTablaChat(){ document.getElementById("tablaScript").style.visibility="hidden"; }
function mostrarTablaChat(){ document.getElementById("tablaScript").style.visibility="visible"; }
var apostarAl = ""; 
var totalGanado = 0;
var totalPerdido = 0;
var rachaPerdidas = 0;
var apuestaBase = 1;
var rondasJugadas = 0;
var modoJuego = "martingala";
var historico = []; 
var totalApuestaActual = 0;
var heApostado = false;
var ultimaApuesta = 0;
var apuestaMax = 0;
var maxGanado = 0;
var start = 0;
var pausa = 1;
var d = new Date();
var textarea = document.getElementById('consolaScript');
function iniciarScript() {
	
	if(start!=1) {
		document.getElementById("consolaScript").innerHTML += "Iniciando ejecución del script\n";
		
		apuestaBase = parseInt(document.getElementById("apuestaBase").value);
		document.getElementById("consolaScript").innerHTML += "Apuesta base: "+apuestaBase+"\n";
		document.getElementById("apuestaBase").disabled = true;
		
		apuestaMax = parseInt(document.getElementById("apuestaMax").value);
		document.getElementById("consolaScript").innerHTML += "Apuesta máxima a realizar: "+apuestaMax+"\n";
		document.getElementById("apuestaMax").disabled = true;
		
		maxGanado = parseInt(document.getElementById("maxGanado").value);
		document.getElementById("consolaScript").innerHTML += "El script se detendra si gana: "+maxGanado+"\n";
		document.getElementById("maxGanado").disabled = true;
		
		modoJuego = document.getElementById("modo").value;
		document.getElementById("consolaScript").innerHTML += "Modo de juego: "+modoJuego+"\n";
		document.getElementById("modo").disabled = true;
		
		document.getElementById("totalGanado").innerHTML = totalGanado;
		document.getElementById("totalPerdido").innerHTML = totalPerdido;
		document.getElementById("rondasJugadas").innerHTML = rondasJugadas;
		document.getElementById("horaInicio").innerHTML = d.getDate() + "/" + d.getMonth() + " " + d.getHours() + "h."+ d.getMinutes() + "m.";
		
		document.getElementById("consolaScript").innerHTML += "Iniciando script....\n";
		textarea.scrollTop = textarea.scrollHeight;
		
		start = 1;
		pausa = 0;
	} else {
		document.getElementById("consolaScript").innerHTML += "El script ya esta en ejecución! espera un momento....\n";
	}
}
function detenerScript() {
	if(pausa!=1) {
		start = 0;
		pausa = 1;
		document.getElementById("consolaScript").innerHTML += "Script detenido! No se realizará ninguna apuesta.\n";
		document.getElementById("apuestaBase").disabled = false;
		document.getElementById("apuestaMax").disabled = false;
		document.getElementById("maxGanado").disabled = false;
		document.getElementById("modo").disabled = false;
	} else {
		document.getElementById("consolaScript").innerHTML += "El script esta detenido! No se realizará ninguna apuesta.\n";
	}
}
clientData.socket.on('roll', function(data){
	//añado el numero ganador al historico
	historico.unshift(data.winner);
	//limito el tamaño del el array a 10 caracteres
	historico.length = 10;
	if(start==1) {
		if(data.winner==0) {
			document.getElementById("consolaScript").innerHTML += "(num: "+data.winner+") Ficha ganadora -> DADOS\n";
			textarea.scrollTop = textarea.scrollHeight;
		} else {
			if(data.winner<=7) {
				document.getElementById("consolaScript").innerHTML += "(num: "+data.winner+") Ficha ganadora -> T\n";
				textarea.scrollTop = textarea.scrollHeight;
			} else {
				document.getElementById("consolaScript").innerHTML += "(num: "+data.winner+") Ficha ganadora -> CT\n";
				textarea.scrollTop = textarea.scrollHeight;
			}
		}
	}
	
	//actualizo las stats
	if(heApostado==true) {
		//obtengo el ultimo numero que ha salido:
		if(historico[0]==0) {
			//Si salio verde, significa que he perdido
			totalPerdido = totalPerdido + totalApuestaActual;
			document.getElementById("totalPerdido").innerHTML = totalPerdido;
		} else if(historico[0]<=7 && ultimaApuesta<=7) {
			//Significa que ha salido T y he acertado
			totalGanado = totalGanado + apuestaBase;
			totalPerdido = 0;
			document.getElementById("totalGanado").innerHTML = totalGanado;
			document.getElementById("totalPerdido").innerHTML = totalPerdido;
		} else if(historico[0]>=8 && ultimaApuesta>=8) {
			//Significa que ha salido CT y he acertado
			totalGanado = totalGanado + apuestaBase;
			totalPerdido = 0;
			document.getElementById("totalGanado").innerHTML = totalGanado;
			document.getElementById("totalPerdido").innerHTML = totalPerdido;
		} else {
			//Significa que he perdido:
			totalPerdido = totalPerdido + totalApuestaActual;
			document.getElementById("totalPerdido").innerHTML = totalPerdido;
		}
	}
	
	if(start==1) {
		//a los 10 segundos llamo a la funcion de apostar:
		setTimeout(function(){realizarApuesta()},10000);
	} else {
		heApostado = false;
	}
	
});

function realizarApuesta() {
	if(start==1) {
		var numero = "";
		//Compruebo el modo de juego
		//¿A que color voy a apostar?
		switch(modoJuego) {
			case "martingala-mismo":
				numero = obtnerUltimoNumeroValido();
				break;
			case "martingala-op":
				numero = obtnerUltimoNumeroValido();
				if(numero!="") {
					if(numero<=7) {
						mumero = 10;
					} else {
						numero = 5;
					}
				}
				break;
			case "martingala-op-porcentaje":
					numero = obtnerUltimoNumeroValido();
					if(numero!="") {
						if(numero<=7) {
							mumero = 10;
						} else {
							numero = 5;
						}
					}
					//recorro el array siempre y cuando sea mayor que 10
					if(historico.length>=10) {
						var ct = 0;
						var t = 0;
						for(aux in historico) {
							if(historico[aux]!=0) {
								if(historico[aux]<=7) {
									t = t+1;
								} else {
									ct = ct+1;
								}
							}
						}
						if(ct<=2) {
							//Si en las ultimas 10 rondas solo han salido 2 CT o menos, apostare a CT
							numero = 10;
						} else {
							if(t<=2) {
								//Si en las ultimas 10 rondas solo han salido 2 T o menos, apostare a T
								numero = 5;
							}
						}
					} else {
						document.getElementById("consolaScript").innerHTML += "Se apostará al color opuesto! Aún no se han almacenado suficientes rondas en el histórico ("+historico.length+"/10) para calcular obtener el porcentaje. \n";
					}
				break;
			case "martingala-mismo-porcentaje":
					numero = obtnerUltimoNumeroValido();
					//recorro el array siempre y cuando sea mayor que 10
					if(historico.length>=10) {
						var ct = 0;
						var t = 0;
						for(aux in historico) {
							if(historico[aux]!=0) {
								if(historico[aux]<=7) {
									t = t+1;
								} else {
									ct = ct+1;
								}
							}
						}
						if(ct<=2) {
							//Si en las ultimas 10 rondas solo han salido 2 CT o menos, apostare a CT
							numero = 10;
						} else {
							if(t<=2) {
								//Si en las ultimas 10 rondas solo han salido 2 T o menos, apostare a T
								numero = 5;
							}
						}
					} else {
						document.getElementById("consolaScript").innerHTML += "Se apostará al mismo color! Aún no se han almacenado suficientes rondas en el histórico ("+historico.length+"/10) para calcular obtener el porcentaje. \n";
					}
				break;
			case "modo-espera":
					//recorro el array siempre y cuando sea mayor que 10
					if(historico.length>=10) {
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
							document.getElementById("consolaScript").innerHTML += "CT no ha salido en las ultimas 10 rondas!\n";
						} else {
							if(!t) {
								//Si no ha salido ningun numero correspondiente a T, apostare a T
								numero = 5;
								document.getElementById("consolaScript").innerHTML += "T no ha salido en las ultimas 10 rondas!\n";
							} else {
								numero = "";
								document.getElementById("consolaScript").innerHTML += "Ronda saltada sin apostar! Esperando al momento oportuno...(CT y T han aparecido en las ultimas 10 rondas)\n";
							}
						}
					} else {
						document.getElementById("consolaScript").innerHTML += "Es necesario almacenar más rondas en el historico "+historico.length+"/10\n";
					}
				break;
			case "porcentaje":
					//recorro el array siempre y cuando sea mayor que 10
					if(historico.length>=10) {
						//recorro el array para ver el total de CT y T que ha salido
						var ct = 0;
						var t = 0;
						for(aux in historico) {
							if(historico[aux]!=0) {
								if(historico[aux]<=7) {
									t = t+1;
								} else {
									ct = ct+1;
								}
							}
						}
						if(ct==t) {
							//Si han saludo las mismas veces en las ultimas 10 rondas... saco uno de ellos random
							numero = Math.floor(Math.random() * (14 - 1)) + 1;
						} else {
							if(ct>t) {
								//Si CT ha salido mas veces... apuesto entonces al T:
								numero = 5;
							} else {
								//Significa que T ha salido mas veces... apuesto entonces al CT
								numero = 10;
							}
						}
					} else {
						document.getElementById("consolaScript").innerHTML += "Es necesario almacenar más rondas en el historico "+historico.length+"/10\n";
					}
				break;
			case "aleatorio":
					//paso de todo los calculos anteriores y apuesto a un numero random...entre 1 y 14
					numero = Math.floor(Math.random() * (14 - 1)) + 1;
				break;
			default:
				break;
		}
		
		//Comrpuebo si en la ultima ronda he ganado o he perdido
		//¿Cuanto voy a apostar?
		if(heApostado==true) {
			//obtengo el ultimo numero que ha salido:
			if(historico[0]==0) {
				//Si salio verde, significa que he perdido
				totalApuestaActual = parseInt(totalApuestaActual*2);
			} else if(historico[0]<=7 && ultimaApuesta<=7) {
				//Significa que ha salido T y he acertado
				totalApuestaActual = parseInt(apuestaBase);
			} else if(historico[0]>=8 && ultimaApuesta>=8) {
				//Significa que ha salido CT y he acertado
				totalApuestaActual = parseInt(apuestaBase);
			} else {
				//Significa que he perdido:
				totalApuestaActual = parseInt(totalApuestaActual*2);
			}
		} else {
			totalApuestaActual = parseInt(apuestaBase);
		}
		
		//Compruebo si la apuesta a realizar sobrepasa la apuesta maxima establecida:
		if(totalApuestaActual>=apuestaMax) {
			start = 0;
			pausa = 1;
			document.getElementById("consolaScript").innerHTML += "Script detenido! La cantidad a apostar superaba la apuesta máxima establecida.\n";
			heApostado == false;
		} else {
			if(totalGanado>=maxGanado) {
				start = 0;
				pausa = 1;
				document.getElementById("consolaScript").innerHTML += "Script detenido! Objetivo de ganancias alcanzado!.\n";
				document.getElementById("apuestaBase").disabled = false;
				document.getElementById("apuestaMax").disabled = false;
				document.getElementById("maxGanado").disabled = false;
				document.getElementById("modo").disabled = false;
				heApostado == false;
			} else {
				if(numero!="") {
					//Miro si el numero se corresponde a CT (del 8 al 14) o T (del 1 al 7)
					if(numero<=7) {
						//T
						document.getElementById("consolaScript").innerHTML += "Enviando apuesta ["+totalApuestaActual+" coins] al T\n";
						textarea.scrollTop = textarea.scrollHeight;

						clientData.socket.emit("place bet", { round: clientData.round, coin: "t", amount: parseInt(totalApuestaActual)});
						heApostado = true;
						
						rondasJugadas = rondasJugadas+1;
						document.getElementById("rondasJugadas").innerHTML = rondasJugadas;
						
						ultimaApuesta = numero;
					} else {
						//ct
						document.getElementById("consolaScript").innerHTML += "Enviando apuesta ["+totalApuestaActual+" coins] al CT\n";
						textarea.scrollTop = textarea.scrollHeight;

						clientData.socket.emit("place bet", { round: clientData.round, coin: "ct", amount: parseInt(totalApuestaActual)});
						heApostado = true;
						
						rondasJugadas = rondasJugadas+1;
						document.getElementById("rondasJugadas").innerHTML = rondasJugadas;
						
						ultimaApuesta = numero;
					}
				} else {
					document.getElementById("consolaScript").innerHTML += "Ronda saltada sin apostar";
					heApostado = false;
				}
			}
		}
	}
}

function obtnerUltimoNumeroValido() {
	//Devuelve el ultimo numero del historico distinto de 0
	for (i=0; i <= 10; i++) { 
		if(historico[i]==undefined) {
			return "";
		} else {
			if(historico[i]!=0) {
				return historico[i];
			}
		}
	}
}
