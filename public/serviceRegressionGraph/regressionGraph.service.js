(function () {
    'use strict';

		
    function service($timeout) {

        const margin = { top: 20, right: 20, bottom: 30, left: 35 };
        const fillStyle = "rgba(0, 0, 0, 0.2)";
        const strokeStyle = "#fff"

        ////////////////////////////////////////////////////////////////////////
        // public API
        var rs = {
            /*Getters*/
            renderRegression: renderRegression,
            clearStyleRegression: clearStyleRegression,
            updateRegressionPoint: updateRegressionPoint
        };
        return rs;

        // MÉTODOS SERVICIO //

        /** Render Graphic Regression
		/*  Params: 
		/*  - div : ID element DIV,
        /*  - config : { 
		/*	            - data: store Array JSON
		/*              - ejeVertical: 1 Column (Bottom)
		/*              - ejeHorizontal: 2 Column (Left) }
		*/
        function renderRegression(div, config) {
            var el = document.getElementById(div);
            if (!el)
                throw new Error('Regression Graph div element not found.');

            if (!config.data)
                throw new Error('No Regression Data Found!!');

            var data = config.data;

            data.forEach(function (d) {
                d.ejeH = d[config.ejeHorizontal.column];
                d.ejeV = d[config.ejeVertical.column];
            });

            var svgWidth = el.hasAttribute("width") ? +el.getAttribute("width") : 800;
            var svgHeight = el.hasAttribute("height") ? +el.getAttribute("height") : 500;

            //remove svg elements
            d3.select("#" + div).select("svg").remove();

            //create svg element
            var objectSVG = d3.select("#" + div).append("svg")
				.attr("width", svgWidth)
				.attr("height", svgHeight);

            objectSVG.append("defs");
              //.append("link")
              //  .attr("href", "css/avalora/GraficoRegresion.css")
              //  .attr("type", "text/css")
              //  .attr("rel", "stylesheet")
              //  .attr("xmlns", "http://www.w3.org/2000/svg");

            var svg = objectSVG.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            

            // add the tooltip area to the webpage
            var tooltip = d3.select("#" + div).append("div")
                .attr("class", "svg-tooltip")
                .style("opacity", 0);

            // draw regression graph
            var width = svgWidth - margin.left - margin.right,
			    height = svgHeight - margin.top - margin.bottom;

            var x = d3.scale.linear()
				.range([0, width]);

            var y = d3.scale.linear()
				.range([height, 0]);

            var xAxis = d3.svg.axis()
				.scale(x)
				.orient("bottom")
			    .tickFormat(function (d) {
			        if ((d / 1000) >= 1) {
			            d = d / 1000 + "K";
			        }
			        return d;
			    });

            var yAxis = d3.svg.axis()
				.scale(y)
				.orient("left")
                .tickFormat(function (d) {
                    if ((d / 1000) >= 1) {
                        d = d / 1000 + "K";
                    }
                    return d;
                });


            x.domain(d3.extent(data, function (d) { return d.ejeH; })).nice();
            y.domain(d3.extent(data, function (d) { return d.ejeV; })).nice();
           
            svg.append("g")
			  .attr("class", "x axis")
			  .attr("transform", "translate(0," + height + ")")
			  .call(xAxis)
			.append("text")
			  .attr("class", "svg-label")
			  .attr("x", width)
			  .attr("y", -6)
			  .style("text-anchor", "end")
			  .text(config.ejeHorizontal.text);

            svg.append("g")
				.attr("class", "y axis")
				.call(yAxis)
			  .append("text")
				.attr("class", "svg-label")
				.attr("transform", "rotate(-90)")
				.attr("y", 6)
				.attr("dy", ".71em")
				.style("text-anchor", "end")
				.text(config.ejeVertical.text)

            svg.selectAll(".dot")
				.data(data)
			  .enter().append("circle")
                .classed("dot", true)
                .attr("id", function (d) { return (config.type === 'LOG' ? 'F' : 'C') + d["ID_MUESTRA"]; })
				.attr("r", 2)
				.attr("cx", function (d) { return x(d.ejeH); })
				.attr("cy", function (d) { return y(d.ejeV); })
                .classed("dot-selected", function (d) { return !d.hasOwnProperty("isSelected") ? false : d.isSelected })
            .on("mouseover", function (d) {
                tooltip.transition()
                     .duration(200)
                     .style("opacity", .9);
                tooltip.html("<div class='g-rc'>Referencia: " + d["PCAT1"] + d["PCAT2"] + "</div>" + (config.type === 'LOG' ? "Log[Sp: " + Math.round(d.ejeH * 100) / 100 : "Sup: " + d.ejeH)
                  + " m², " + (config.type === 'LOG' ? "VT: " + Math.round(d.ejeV * 100) / 100 + "]" : "V.Tras: " + d.ejeV))
                     .style("left", (d3.event.offsetX + 15) + "px")
                     .style("top", (d3.event.offsetY - 45) + "px");
            })
            .on("mouseout", function (d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
            .on("click", function (d) {
                config.isSelectedByRegression = true;
                config.onClickSelected(d);
            });


            if (data.length > 0) {

                var lrdata = data.map(function (d) { return [+d.ejeH, +d.ejeV] });
                var linReg = ss.linearRegression(lrdata);
                var regressionLine = ss.linearRegressionLine(linReg);
                var rSq = ss.rSquared(lrdata, regressionLine);

                //Set Values of lineal Regression
                config.linearRegression = linReg;

                //Cálculo para el excedentes de la línea de Regresion CENTRAL
                var max = d3.max(data, function (d) { return d.ejeH; });
                var xmin = x.domain()[0];
                var ymin = y.domain()[0];
                var y2min = xmin * linReg.m + linReg.b;
                if (ymin > y2min) {
                    xmin = (ymin - linReg.b) / linReg.m;
                };

                svg.append("svg:line")
                      .attr("class", "reg")
                      .attr("x1", x(xmin))
                      .attr("y1", y((xmin * linReg.m) + linReg.b))
                      .attr("x2", x(max))
                      .attr("y2", y((max * linReg.m) + linReg.b));




                renderRegression.getCalculateModelo = function(mapResiduos){
                //Resumen modelo
                var p_min = ss.min(mapResiduos);
                var p_25 = ss.quantile(mapResiduos, 0.25);
                var p_50 = ss.quantile(mapResiduos, 0.50);
                var p_75 = ss.quantile(mapResiduos, 0.75);
                var p_max = ss.max(mapResiduos);
                
                    return { 'min': parseFloat(p_min.toFixed(2)), 'Q1': parseFloat(p_25.toFixed(2)), 'mediana': parseFloat(p_50.toFixed(2)), 'Q3': parseFloat(p_75.toFixed(2)), 'max': parseFloat(p_max.toFixed(2)), 'rSquared': parseFloat(rSq.toFixed(2)) };
                }

                if (config.type === 'LOG') {

                    //Residuos LOG
                    data.forEach(function (d) {
                        d.residuosLOG = d.ejeV - (linReg.b + (linReg.m * d.ejeH))
                    });

                    var mapResiduos = data.map(function (d) { return d.residuosLOG; });
                    config.resumen_modelo = renderRegression.getCalculateModelo(mapResiduos);
              

                    var IQ = config.resumen_modelo.Q3 - config.resumen_modelo.Q1;
                    var out_sup = config.resumen_modelo.Q3 + 1.5 * IQ;
                    var out_inf = config.resumen_modelo.Q1 - 1.5 * IQ;

                    //Cálculo para el excedentes de la línea de Regresion SUPERIOR
                    var xmin = x.domain()[0];
                    var y2min = xmin * linReg.m + linReg.b + out_sup;
                    if (ymin > y2min) {
                        xmin = (ymin - linReg.b - out_sup) / linReg.m;
                    };


                    //Draw Interval Superior Line
                    svg.append("svg:line")
                          .attr("class", "lineaInteval")
                          .attr("x1", x(xmin))
                          .attr("y1", y((xmin * linReg.m) + linReg.b + out_sup))
                          .attr("x2", x(max))
                          .attr("y2", y((max * linReg.m) + (linReg.b + out_sup)));


                    //Cálculo para el excedentes de la línea de Regresion INFERIOR
                    var xmin = x.domain()[0];
                    var y2min = xmin * linReg.m + linReg.b + out_inf;
                    if (ymin > y2min) {
                        xmin = (ymin - linReg.b - out_inf) / linReg.m;
                    };

                    //Draw Interval Inferior Line
                    svg.append("svg:line")
                          .attr("class", "lineaInteval")
                          .attr("x1", x(xmin))
                          .attr("y1", y((xmin * linReg.m) + linReg.b + out_inf))
                          .attr("x2", x(max))
                          .attr("y2", y((max * linReg.m) + (linReg.b + out_inf)));

                    d3.select("#resumenLOG").html('Log(Valor) = ' + Math.round(linReg.b * 100) / 100 + ' + ' + Math.round(linReg.m * 100) / 100 + ' * Log(Superficie) </br>' +
                        'Outlier Sup. Resid: ' + Math.round(out_sup * 10000) / 10000 + ',  Outlier Inf. Resid: ' + Math.round(out_inf * 10000) / 10000);

                    //Set Outlet Values
                    config.outlets = { superior: out_sup, inferior: out_inf };
                }
                else {

                    //Residuos LIN
                    data.forEach(function (d) {
                        d.residuosLIN = d.ejeV - (linReg.b + (linReg.m * d.ejeH))
                    });

                    var mapResiduos = data.map(function (d) { return d.residuosLIN; });
                    config.resumen_modelo = renderRegression.getCalculateModelo(mapResiduos);

                    //Calculo del valor medio de la regression
                    var sum_Val_Unit = 0, tot_muestr = 0;
                    data.forEach(function (d) {
                        sum_Val_Unit += (linReg.b + (linReg.m * d.ejeH)) * 10000 / d.ejeH;
                        tot_muestr++;
                    })
                    config.valorReg = sum_Val_Unit / tot_muestr;

                    //print resume values in template
                    var html = "<span style='padding-left: 10%;'>Ecuaci&oacute;n modelo:&nbsp;&nbsp;&nbsp;Valor = " + Math.round(linReg.b * 100) / 100 + " + " + Math.round(linReg.m * 100) / 100 + " * Superficie</span>";                               
                    d3.select("#resumenLIN").html(html);
                          
                }


            }

        }

        /* Clear all Points Selection
        */
        function clearStyleRegression() {
            d3.selectAll(".dot").style('fill', fillStyle);
        }

        /* Change the color style of each point 
        */
        function updateRegressionPoint(id, color) {
            if (!color) {
                d3.select("#C" + id).transition()
                    .style('stroke-width', 10)
                    .transition()
                    .duration(3000).style('stroke-width', null);

                d3.select("#C" + id).classed("dot-selected", false);
                d3.select("#F" + id).classed("dot-selected", false);
            }
            else {
                d3.select("#C" + id).classed("dot-selected", true).transition().duration(700);
                d3.select("#F" + id).classed("dot-selected", true).transition().duration(700);
            }
        }

    };

    angular
	  .module('app')
	  .factory('regressionService', service);

    service.$inject = ['$timeout'];


})();