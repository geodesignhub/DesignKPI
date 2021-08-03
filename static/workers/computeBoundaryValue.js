importScripts('../js/turf.min.js');
importScripts('../js/rtree.min.js');

function computeBoundaryValue(design, boundary, investmentdata, selectedsystems, systemdetails, numYears, saved_asset_details, startyear) {
    // get the grid in a rTree

    var boundary = JSON.parse(boundary);
    var systemdetails = JSON.parse(systemdetails);
    var design = JSON.parse(design);
    var investmentdata = JSON.parse(investmentdata);
    var selectedsystems = JSON.parse(selectedsystems);
    var saved_asset_details = JSON.parse(saved_asset_details);
    var number_of_years = numYears;
    var maxYearlyCost = 0;
    // loop over boundaries
    var selectedsystems = selectedsystems.map(function (x) {
        return parseInt(x, 10);
    });
    var counter = 0;

    function makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 6; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }
    var gridTree = RTree();
    gridTree.geoJSON(design);
    var newboundaries = {
        "type": "FeatureCollection",
        "features": []
    };
    var bfeatlen = boundary.features.length;

    var fullproc = bfeatlen;
    for (var j2 = 0; j2 < bfeatlen; j2++) {
        var cbndfeat = boundary.features[j2];
        var bndid = makeid();
        cbndfeat.properties.id = bndid;
        newboundaries.features.push(cbndfeat);
    }
    var bndIDDiags = {};
    var bnd_diagram_intersects = {};
    for (var j = 0; j < bfeatlen; j++) {
        var curbnd = newboundaries.features[j];
        var curBndbounds = turf.bbox(curbnd);
        var cData = gridTree.bbox([curBndbounds[0], curBndbounds[1]], [curBndbounds[2], curBndbounds[3]]); // array of features

        // get all the diagrams within this boundary
        var curbndid = curbnd.properties.id;
        bndIDDiags[curbndid] = {};
        var diags = [];
        for (var g1 = 0; g1 < cData.length; g1++) {
            var curIFeatGrid = cData[g1];
            var project_or_policy = curIFeatGrid.properties.areatype;
            if (project_or_policy == 'project') {
                var curIFeatDiagramID = curIFeatGrid.properties.diagramid;
                var cur_feat_area = turf.area(curIFeatGrid);

                var ifeat;
                var intersect_area = 0;

                cur_feat_area = isNaN(cur_feat_area) ? 0 : cur_feat_area;

                const bnd_diag_id = curbndid + '-' + curIFeatDiagramID;
                var factor = 1;
                try {
                    ifeat = turf.intersect(curbnd, curIFeatGrid);
                    intersect_area = turf.area(ifeat);

                } catch (err) { //throw JSON.stringify(err)
                    // console.log(err);
                    cur_feat_area = 0;
                } // catch ends
                if (ifeat) {

                    factor = (intersect_area / cur_feat_area);
                    factor = isNaN(factor) ? 0 : factor;

                    bnd_diagram_intersects[bnd_diag_id] = { 'factor': factor };
                    diags.push(curIFeatDiagramID);
                }
            }

        }
        bndIDDiags[curbndid]['diagrams'] = diags;
    }
    // console.log(JSON.stringify(bndIDDiags));
    // console.log(JSON.stringify(selectedsystems));
    var opboundaries = {
        "type": "FeatureCollection",
        "features": []
    };


    for (var j3 = 0; j3 < bfeatlen; j3++) {
        var cbndfeat = newboundaries.features[j3];
        var bndID = cbndfeat.properties.id;
        var diagramIDs = bndIDDiags[bndID]['diagrams'];

        var totalInvestment = 0;
        var yearlyInvestment = {}

        var total_population = 0;
        var total_direct_employment = 0;
        var total_indirect_employment = 0;
        var total_visitors = 0;

        // Services
        var hospital_beds = 0;
        var police_stations = 0;
        var fire_personnel = 0;
        var schools = 0;
        var electricity_demand = 0;
        var water_demand = 0;
        var sewage_demand = 0;
        var road_usage = 0;
        var rail_usage = 0;

        bndIDDiags[bndID]['services'] = {};
        bndIDDiags[bndID]['investment'] = {};
        bndIDDiags[bndID]['income'] = {};
        bndIDDiags[bndID]['maintainence'] = {};

        for (var k6 = 0; k6 < number_of_years; k6++) {
            var sYear = (startyear + k6);
            bndIDDiags[bndID]['investment'][sYear] = 0;
            bndIDDiags[bndID]['income'][sYear] = 0;
            bndIDDiags[bndID]['maintainence'][sYear] = 0;
        }


        // get the items in the grid that intersect the boundary. 
        for (var i1 = 0; i1 < investmentdata.length; i1++) { // loop over the investment data. 
            var curData = investmentdata[i1]; // current investment data
            var diagID = curData.id; // diagram id of the current investment
            var sysID = curData.sysid;
            var factor = 1;

            if (diagramIDs.includes(diagID) && (selectedsystems.includes(sysID))) {
                for (let p1 = 0; p1 < saved_asset_details.length; p1++) {
                    const cur_diagram_saved_details = saved_asset_details[p1];
                    // console.log('aser asr');
                    const diag_id = parseInt(cur_diagram_saved_details['key'].split('-')[1]);
                    // console.log(diagID, diag_id)
                    if (diag_id == diagID) {
                        const saved_bnd_diag_id = bndID + '-' + diag_id;
                        var cur_diagram_asset_details;
                        if (cur_diagram_saved_details.hasOwnProperty('asset_set') && (cur_diagram_saved_details['asset_set'] == '1' || cur_diagram_saved_details['asset_set'] == 1)) {
                            cur_diagram_asset_details = cur_diagram_saved_details['asset_details'];
                        } else {
                            cur_diagram_asset_details = {};
                        }

                        // console.log(factor);
                        // console.log('---')
                        factor = bnd_diagram_intersects[saved_bnd_diag_id]['factor'];
                        // console.log(factor);
                        // console.log('**')

                        if (typeof cur_diagram_asset_details == 'string') {
                            cur_diagram_asset_details = JSON.parse(cur_diagram_asset_details);
                        }

                        if (Object.keys(cur_diagram_asset_details).length === 0 && cur_diagram_asset_details.constructor === Object) {

                        } else if (Object.keys(cur_diagram_asset_details).length > 0 && cur_diagram_asset_details.constructor === Object) {
                            // check the intersection                             
                            if (cur_diagram_asset_details['class'] == 'residential') {
                                var population = cur_diagram_asset_details['metadata']['number_of_people_residential'];
                                var factored_population = population * factor;
                                total_population += parseInt(factored_population);
                            }
                            else if (cur_diagram_asset_details['class'] == 'community') {
                                var visitors = cur_diagram_asset_details['metadata']['community_visitors'];
                                var factored_visitors = visitors * factor;
                                total_visitors += parseInt(factored_visitors);
                            }
                            else if (cur_diagram_asset_details['class'] == 'hospitality') {
                                var yearly_visitors = cur_diagram_asset_details['metadata']['total_yearly_visitors'];
                                const visitors = parseInt(yearly_visitors / 365);
                                var factored_visitors = visitors * factor;
                                total_visitors += parseInt(factored_visitors);

                                var direct_employment = cur_diagram_asset_details['metadata']['total_direct_employment_tourism'];
                                var factored_direct_employment = direct_employment * factor;
                                total_direct_employment += parseInt(factored_direct_employment);

                                var indirect_employment = cur_diagram_asset_details['metadata']['total_indirect_employment_tourism'];
                                var factored_indirect_employment = indirect_employment * factor;
                                total_indirect_employment += parseInt(factored_indirect_employment);
                            }

                            else if (cur_diagram_asset_details['class'] == 'retail') {

                                var visitors = cur_diagram_asset_details['metadata']['total_daily_visitors_retail'];
                                var factored_visitors = visitors * factor;
                                total_visitors += parseInt(factored_visitors);

                                var direct_employment = cur_diagram_asset_details['metadata']['total_direct_employment_retail'];
                                var factored_direct_employment = direct_employment * factor;
                                total_direct_employment += parseInt(factored_direct_employment);

                                var indirect_employment = cur_diagram_asset_details['metadata']['total_indirect_employment_retail'];
                                var factored_indirect_employment = indirect_employment * factor;
                                total_indirect_employment += parseInt(factored_indirect_employment);
                            }
                            else if (cur_diagram_asset_details['class'] == 'office') {

                                var visitors = cur_diagram_asset_details['metadata']['total_daily_visitors_office'];
                                var factored_visitors = visitors * factor;
                                total_visitors += parseInt(factored_visitors);

                                var direct_employment = cur_diagram_asset_details['metadata']['total_direct_employment_office'];
                                var factored_direct_employment = direct_employment * factor;
                                total_direct_employment += parseInt(factored_direct_employment);

                                var indirect_employment = cur_diagram_asset_details['metadata']['total_indirect_employment_office'];
                                var factored_indirect_employment = indirect_employment * factor;
                                total_indirect_employment += parseInt(factored_indirect_employment);

                            }
                            else if (cur_diagram_asset_details['class'] == 'amenity') {

                                var visitors = cur_diagram_asset_details['metadata']['total_daily_visitors_amenity'];
                                var factored_visitors = visitors * factor;
                                total_visitors += parseInt(factored_visitors);

                                var direct_employment = cur_diagram_asset_details['metadata']['total_direct_employment_amenity'];
                                var factored_direct_employment = direct_employment * factor;
                                total_direct_employment += parseInt(factored_direct_employment);

                                var indirect_employment = cur_diagram_asset_details['metadata']['total_indirect_employment_amenity'];
                                var factored_indirect_employment = indirect_employment * factor;
                                total_indirect_employment += parseInt(factored_indirect_employment);

                            }


                            else if (cur_diagram_asset_details['class'] == 'mixuse') {

                                var population = cur_diagram_asset_details['metadata']['number_of_people_residential_mixuse'];
                                var factored_population = population * factor;
                                total_population += parseInt(factored_population);
                                var visitors = cur_diagram_asset_details['metadata']['total_daily_visitors_retail_mixuse'];
                                var factored_visitors = visitors * factor;
                                total_visitors += parseInt(factored_visitors);

                                var direct_employment = cur_diagram_asset_details['metadata']['total_direct_employment_retail_mixuse'];
                                var factored_direct_employment = direct_employment * factor;
                                total_direct_employment += parseInt(factored_direct_employment);

                                var indirect_employment = cur_diagram_asset_details['metadata']['total_indirect_employment_retail_mixuse'];
                                var factored_indirect_employment = indirect_employment * factor;
                                total_indirect_employment += parseInt(factored_indirect_employment);

                            }

                            var diagram_services = cur_diagram_asset_details['metadata']['services'];
                            // console.log(diagram_services['total_water_demand'],factor, diagID);
                            if (typeof diagram_services === 'undefined') { } else {
                                const t_hosp_beds = diagram_services['hospital_beds'] * factor;
                                const t_police_stations = diagram_services['total_police_stations'] * factor;
                                const t_firestations = diagram_services['total_firestations'] * factor;
                                const t_schools = diagram_services['total_schools'] * factor;
                                const t_energy_demand = diagram_services['total_energy_demand'] * factor;
                                const t_water_demand = diagram_services['total_water_demand'] * factor;
                                const t_sewage_demand = diagram_services['total_sewage_demand'] * factor;
                                const t_total_road = diagram_services['total_road_usage'] * factor;
                                const t_total_rail = diagram_services['total_rail_usage'] * factor;
                                // console.log(diagram_services['hospital_beds'] , factor);
                                hospital_beds += t_hosp_beds;
                                police_stations += t_police_stations;
                                fire_personnel += t_firestations;
                                schools += t_schools;
                                electricity_demand += t_energy_demand;
                                water_demand += t_water_demand;
                                sewage_demand += t_sewage_demand;
                                road_usage += t_total_road;
                                rail_usage += t_total_rail;
                            }

                        }
                    }
                }

                totalInvestment += (curData['totalInvestment'] * factor);
                const yearly_investment = curData['investment'];
                const yearly_income = curData['income'];
                const yearly_opex = curData['maintainence'];


                for (let cur_year in yearly_investment) {
                    const c_year = parseInt(cur_year);
                    const tmp_yrl_investemnt = yearly_investment[c_year];
                    maxYearlyCost = (tmp_yrl_investemnt > maxYearlyCost) ? tmp_yrl_investemnt : tmp_yrl_investemnt;
                    bndIDDiags[bndID]['investment'][c_year] += tmp_yrl_investemnt * factor;
                }
                maxYearlyCost = 0;
                for (let cur_year in yearly_income) {

                    const c_year = parseInt(cur_year);
                    const tmp_yrl_income = yearly_income[c_year];
                    maxYearlyCost = (tmp_yrl_income > maxYearlyCost) ? tmp_yrl_income : tmp_yrl_income;
                    // console.log(tmp_yrl_income,factor);
                    bndIDDiags[bndID]['income'][c_year] += tmp_yrl_income * factor;
                }
                maxYearlyCost = 0;
                for (let cur_year in yearly_opex) {
                    const c_year = parseInt(cur_year);
                    const tmp_yrl_opex = yearly_opex[c_year];
                    maxYearlyCost = (tmp_yrl_opex > maxYearlyCost) ? tmp_yrl_opex : tmp_yrl_opex;

                    bndIDDiags[bndID]['maintainence'][c_year] += tmp_yrl_opex * factor;
                }

            }
        }

        bndIDDiags[bndID]['totalInvestment'] = totalInvestment;
        bndIDDiags[bndID]['bname'] = cbndfeat.properties.bname;

        bndIDDiags[bndID]['total_population'] = total_population;
        bndIDDiags[bndID]['total_direct_employment'] = total_direct_employment;
        bndIDDiags[bndID]['total_indirect_employment'] = total_indirect_employment;
        bndIDDiags[bndID]['total_visitors'] = total_visitors;
        // console.log(total_visitors)

        bndIDDiags[bndID]['services']['hospital_beds'] = parseInt(hospital_beds);
        bndIDDiags[bndID]['services']['police_stations'] = parseInt(police_stations);
        bndIDDiags[bndID]['services']['fire_personnel'] = parseInt(fire_personnel);
        bndIDDiags[bndID]['services']['schools'] = parseInt(schools);

        bndIDDiags[bndID]['services']['electricity_demand'] = parseInt(electricity_demand);
        bndIDDiags[bndID]['services']['water_demand'] = parseInt(water_demand);
        bndIDDiags[bndID]['services']['sewage_demand'] = parseInt(sewage_demand);
        bndIDDiags[bndID]['services']['road_usage'] = parseInt(road_usage);
        bndIDDiags[bndID]['services']['rail_usage'] = parseInt(rail_usage);


        cbndfeat.properties.totalInvestment = totalInvestment;
        cbndfeat.properties.investment = yearlyInvestment;
        opboundaries.features.push(cbndfeat);
        counter += 1;

        self.postMessage({
            'percentcomplete': parseInt((100 * counter) / fullproc),
            'mode': 'status',
        });
    }
    // console.log(opboundaries)

    self.postMessage({
        'boundaryValue': JSON.stringify(bndIDDiags),
        'newboundaries': JSON.stringify(opboundaries),
        'stdVar': maxYearlyCost
    });

    // close the worker
    // self.close();
}
self.onmessage = function (e) {
    computeBoundaryValue(e.data.design, e.data.boundaries, e.data.investmentdata, e.data.selectedsystems, e.data.systemdetails, e.data.number_of_years, e.data.saved_diagram_details, e.data.start_year);
}