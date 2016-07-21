/* Evento para Filtrar los residuos desde el Filtro de Regresi&oacute;n */
        vm.applyFilterResiduos = function () {



            var date = new Date();
            console.log("propagarCambioGlobal Inicio: " + date);
            $("#textoVentanaCarga").html("<span class='glyphicon glyphicon-time'></span> Un momento por favor...");
            $('#myPleaseWait').modal('show');


            $timeout(function () {
                //Limpiamos los seleccionados
                for (var i = 0; i < vm.datosMuestras_ARH_AC.length; i++) {
                    if (vm.datosMuestras_ARH_AC[i].isSelected) {
                        vm.datosMuestras_ARH_AC[i].isSelected = false;
                        vm.propagarCambioMuestra(vm.datosMuestras_ARH_AC[i]);
                    }
                }

                var config = vm.configRegressionLogaritmica,
                    sel = config.data.filter(function (d) { return d.residuosLOG > config.outlets.superior || d.residuosLOG < config.outlets.inferior })

                sel.forEach(function (row) {
                    row.isSelected = true;
                    vm.propagarCambioMuestra(row);
                });
                vm.propagarCambioGlobal();


            }, 1000);
        }

        /* Evento para Filtrar las superficies no representativas desde el Gráfico de Distrubución */
        vm.applyFilterSupNoRepresentativa = function () {

            var date = new Date();
            console.log("propagarCambioGlobal Inicio: " + date);
            $("#textoVentanaCarga").html("<span class='glyphicon glyphicon-time'></span> Un momento por favor...");
            $('#myPleaseWait').modal('show');

            $timeout(function () {
                //Limpiamos los seleccionados
                for (var i = 0; i < vm.datosMuestras_ARH_AC.length; i++) {
                    if (vm.datosMuestras_ARH_AC[i].isSelected) {
                        vm.datosMuestras_ARH_AC[i].isSelected = false;
                        vm.propagarCambioMuestra(vm.datosMuestras_ARH_AC[i]);
                    }
                }


                var sup_p_3 = Math.pow((vm.tablaDetalleDatosPercentiles.PUNTOS[3].x2), 2);
                var sup_p_85 = Math.pow((vm.tablaDetalleDatosPercentiles.PUNTOS[20].x2), 2);

                for (var i = 0, l = vm.datosMuestras_ARH_AC.length; i < l; ++i) {
                    var muestra = vm.datosMuestras_ARH_AC[i];
                    if (muestra.SUP_SUBPARCELA < sup_p_3 || muestra.SUP_SUBPARCELA > sup_p_85) {

                        muestra.isSelected = true;
                        vm.propagarCambioMuestra(muestra);
                    }
                }

                vm.propagarCambioGlobal();
            }, 1000);
        }

        vm.descargarGrafico = function (canvasId, invertirColores, width, height) {

            var canvas = document.getElementById(canvasId);
            var ctx = canvas.getContext("2d");

            if (invertirColores)
                servicioUtilidades.canvasInvertColor(ctx, width, height);

            var virtualDownload = document.createElement('a');
            var dataURL = canvas.toDataURL('image/png');
            virtualDownload.href = dataURL;
            virtualDownload.download = "grafico.png";
            document.body.appendChild(virtualDownload);
            virtualDownload.click();
            document.body.removeChild(virtualDownload);

            if (invertirColores)
                servicioUtilidades.canvasInvertColor(ctx, width, height);
        }

        /* Evento para Actualizar el cálculo de Regresión Lineal */
        vm.actualizarCalculoRegresionLineal = function () {
            //if (!vm.calculoRegresion) return;

            if (typeof vm.configRegressionLineal === 'object') {

                if (!vm.configRegressionLineal.isSelectedByRegression)
                    __CreateRegressionLineal();
            }

        }

        /* Método del Evento desde OnClick desde el Gráfico de Regresión */
        function __clickSelectedPoint(row) {

            var date = new Date();
            console.log("propagarCambioGlobal Inicio: " + date);
            $("#textoVentanaCarga").html("<span class='glyphicon glyphicon-time'></span> Un momento por favor...");
            $('#myPleaseWait').modal('show');
            var evento = event.shiftKey;

            $timeout(function () {
                /*Sino tenemos seleccionadas las mayusculas Limpiamos las muestras seleccionadas*/
                if (!evento) {
                    for (var i = 0; i < vm.datosMuestras_ARH_AC.length; i++) {
                        if (vm.datosMuestras_ARH_AC[i].isSelected) {
                            vm.datosMuestras_ARH_AC[i].isSelected = false;
                            vm.propagarCambioMuestra(vm.datosMuestras_ARH_AC[i]);
                        }
                    }
                }

                row.isSelected = !row.isSelected;
                vm.propagarCambioMuestra(row);
                vm.propagarCambioGlobal();
                vm.configRegressionLineal.isSelectedByRegression = false;

            }, 1000);
        }

        /* Crea el gráfico de Regresión Lineal */
        function __CreateRegressionLineal() {
            var storeRegressionIncluidas = vm.datosMuestras_ARH_AC.filter(function (reg) {
                return reg.Incluida === true
            });

            vm.configRegressionLineal = {
                data: storeRegressionIncluidas,
                ejeHorizontal: { column: 'SUPERFICIE', text: 'Superficie (m²)' },
                ejeVertical: { column: 'VTRA', text: 'V. Transmision (€)' },
                colorSeleccion: colorSeleccionMuestra,
                onClickSelected: __clickSelectedPoint,
                type: 'LIN'
            }
            regressionService.renderRegression('RegresionLIN', vm.configRegressionLineal);
        }

        /* Crea el gráfico de Filtro de Regresión Logartimica */
        function __CreateRegressionLogaritmica() {

            vm.configRegressionLogaritmica = {
                data: vm.datosMuestras_ARH_AC,
                ejeHorizontal: {
                    column: 'LOG_SUPERFICIE', text: 'Log. Superficie (m²)'
                },
                ejeVertical: {
                    column: 'LOG_VTRA', text: 'Log. V. Transmision (€)'
                },
                colorSeleccion: colorSeleccionMuestra,
                onClickSelected: __clickSelectedPoint,
                type: 'LOG'
            }
            regressionService.renderRegression('RegresionLOG', vm.configRegressionLogaritmica);
        }