(function () {
	'use strict';


	function service(dictionaryService) {

	    ////////////////////////////////////////////////////////////////////////
	    // public API
	    var ms = {
	        redondeo2decimales: redondeo2decimales,
	        decompressJson: decompressJson,
	        compressJson: compressJson,
	        getItem: getItem,
	        padLeft: padLeft,
	        generarCodigoMunicipio: generarCodigoMunicipio,
	        getParameterByName: getParameterByName,
	        convertToCSV: ConvertToCSV,
	        textTransition: TextTransition,
	        canvasInvertColor: CanvasInvertColor,
	        getStyleSheet: getStyleSheet,
	    };
	    return ms;

	    ////////////////////////////////////////////////////////////////////////
	    // Funciones Publicas		


	    function redondeo2decimales(numero) {
	        var flotante = parseFloat(numero);
	        var resultado = Math.round(flotante * 100) / 100;
	        return resultado;
	    }

	    function padLeft(n, width, z) {
	        z = z || '0';
	        n = n + '';
	        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	    }

	    function generarCodigoMunicipio(idProv, idMuni) {
	        return padLeft(idProv, 2).toString().concat(padLeft(idMuni, 3).toString());
	    }

	    function decompressJson(jsonComp) {

	        var json = [];
	        var campos = jsonComp[0];
	        for (var i = 1; i < jsonComp.length; i++) {
	            var reg = {};
	            var line = jsonComp[i];
	            for (var z = 0; z < campos.length; z++) {
	                reg[campos[z]] = line[z];
	            }
	            json.push(reg);
	        }
	        return json;
	    }

	    function compressJson(json) {
	        var jsonComp = [];
	        if (json.length > 0) {
	            var keys = Object.keys(json[0]);
	            jsonComp.push(keys);
	            for (var i = 0; i < json.length; i++) {
	                var reg = json[i];
	                var nuevoReg = [];
	                var keys = Object.keys(reg);
	                for (var k = 0; k < keys.length; k++) {
	                    var valor = reg[keys[k]];
	                    nuevoReg.push(valor);
	                }
	                jsonComp.push(nuevoReg);
	            }
	        }
	        return jsonComp;
	    }

	    /*Realiza un filtro a un objetoJson por un atributo y un valor*/
	    function getItem(objetoJson, atributo, filtro) {
	        return objetoJson.filter(
	    		function (Objeto) {
	    		    return (Objeto[atributo] == filtro)
	    		}
	    	);
	    }


	    /*****    ******/
	    function getParameterByName(name, url) {
	        if (!url) url = window.location.href;
	        name = name.replace(/[\[\]]/g, "\\$&");
	        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
				results = regex.exec(url);
	        if (!results) return null;
	        if (!results[2]) return '';
	        return decodeURIComponent(results[2].replace(/\+/g, " "));
	    }


	    function ConvertToCSV(objArray, filtroCampos, camposString, camposTrad) {
	        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
	        var str = '';
	        var cabeceraGenerada = false;

	        for (var i = 0; i < array.length; i++) {

	            var line = '';

	            if (!cabeceraGenerada) {
	                for (var index in array[i]) {
	                    if (filtroCampos(index)) {
	                        if (mapeo_campos_csv_muestras[index])
	                            index = mapeo_campos_csv_muestras[index];
	                        line += '"' + index + '",';
	                    }

	                }
	                str += line + '\r\n';
	                cabeceraGenerada = true;
	            }

	            var line = '';

	            for (var index in array[i]) {
	                if (filtroCampos(index)) {
	                    if (line != '') line += ','
	                    var value = array[i][index];
	                    if (!value)
	                        value = '';

	                    if (camposTrad && camposTrad.indexOf(index) != -1) {
	                        var obj = {};
	                        obj[index] = value;
	                        value = dictionaryService.translate([obj])[0][index];
	                    }

	                    if (camposString && camposString.indexOf(index) != -1)
	                        line += '"' + value + '"';
	                    else
	                        line += value;
	                }
	            }

	            str += line + '\r\n';
	        }

	        return str;
	    }

	    function TextTransition(elemChanged, elemSource, elementId, fromColor, toColor, time) {

	        var mostrarEfecto = false;

	        if (elemChanged != undefined) {
	            if (Object.prototype.toString.call(elemChanged) === '[object Array]') {
	                if (elemChanged.length != elemSource.length)
	                    mostrarEfecto = true;
	            }
	            else {
	                if (!isNaN(elemSource) && elemChanged != elemSource)
	                    mostrarEfecto = true;
	            }
	        }
	        else {
	            mostrarEfecto = true;
	        }

	        //elemChanged = elemSource;

	        if (mostrarEfecto) {
	            jQuery('#' + elementId).css("transition", "color 0.2s");
	            jQuery('#' + elementId).css("color", fromColor);
	            setTimeout(function () {
	                jQuery('#' + elementId).css("transition", "color " + time + "s");
	                jQuery('#' + elementId).css("color", toColor);
	            }, 500);
	        }

	    }

	    function CanvasInvertColor(context, width, height) {
	   
	        var imageData = context.getImageData(0, 0, width, height);
	        var data = imageData.data;

	        for(var i = 0; i < data.length; i += 4) {
	            // red
	            data[i] = 255 - data[i];
	            // green
	            data[i + 1] = 255 - data[i + 1];
	            // blue
	            data[i + 2] = 255 - data[i + 2];	         
	        }

	         //overwrite original image
	        context.putImageData(imageData, 0, 0);
	    }


	    function getStyleSheet(unique_title) {
	        for (var i = 0; i < document.styleSheets.length; i++) {
	            var sheet = document.styleSheets[i];
	            if (sheet.title == unique_title) {
	                return sheet;
	            }
	        }
	    }

	    
	};


    /**
 * Servicio de Utilidades
 */
	angular
	  .module('app')
	  .factory('servicioUtilidades', service);

	service.$inject = ['dictionaryService'];

})();