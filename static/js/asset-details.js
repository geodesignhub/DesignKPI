function get_asset_details(diagram_id) {
  var url = '/get_asset_details/';
  diagramid = diagram_id;
  const data = {
    'projectid': projectid, 'diagramid': diagram_id, 'apitoken': apitoken, 'boardid': design_url_details.boardid, 'cteamid': design_url_details.cteamid, "synthesisid": design_url_details.synthesisid,
    "_csrf": csrf
  }
  var promise = $.ajax({
    url: url,
    type: 'POST',
    data: data
  });

  promise.done(function (asset_data) {
   
    $("#asset-details").removeClass('d-none');
    $("#financial-details").addClass('d-none');
   
    var defaultvalues = asset_data.opts.defaultvalues;
    diagramdetail = asset_data.opts.diagramdetail;
    if (typeof defaultvalues == 'string') {
      defaultvalues = JSON.parse(defaultvalues);
    }
    if (defaultvalues.asset_set)
    {
      if (!('asset_details' in defaultvalues) || Object.keys(defaultvalues['asset_details']).length === 0 || defaultvalues['asset_details'].constructor === Object) {
        var class_default_values = {};
      } else {
        var class_default_values = JSON.parse(defaultvalues['asset_details']);
        var asset_class = class_default_values.class;
        if (asset_class) {
          render_saved_asset_data({"asset_class":asset_class, "class_default_values":class_default_values});
        }
        
      }
    }
    else{ 
      $(".usage_form").addClass('d-none');
      $(".services_form").addClass('d-none');
      $("#base_asset_class").prop('selectedIndex', 0);
      $("#base_asset_subclass").prop('selectedIndex', 0);
      $("#base_asset_subclass_image").val("");
      $("#selected_typology_image").empty();
      representative_image = "";
    }
   
    render_diagram_details([defaultvalues, asset_data.opts.diagramdetail]);

    humane.log("Data successufully loaded", {
      addnCls: 'humane-flatty-success'
    });

  });

  promise.fail(function (data) {

    $("#asset-details").addClass('d-none');
    $("#financial-details").addClass('d-none');
    humane.log("Error in receiving data, the administrators have been notified", {
      addnCls: 'humane-flatty-error'
    });
  });

}



//built and non-built environment
// Agriculture source: https://owlcation.com/agriculture/Types-of-Agriculture
const data = {
  "residential": "Luxury,High Priced,Mid Priced,Low Priced,Affordable Housing,Full Rennovation,Medium Rennovation,Low Rennovation",
  "hospitality": "Upscale Hotel,Midscale Hotel,Budget Hotel,Full Rennovation,Medium Rennovation,Low Rennovation",
  "community": "Community Center,Playground,Amenity,Full Rennovation,Medium Rennovation,Low Rennovation",
  "tourism": "Eco Tourism,Low Density Attraction,High Density Attraction,Full Rennovation,Medium Rennovation,Low Rennovation",
  "retail": "New Build,Full Rennovation,Medium Rennovation,Low Rennovation",
  "mixuse": "New Build,Full Rennovation,Medium Rennovation,Low Rennovation",
  "office": "New Build,Full Rennovation,Medium Rennovation,Low Rennovation",
  "amenity": "New Build,Full Rennovation,Medium Rennovation,Low Rennovation",
  "transport": "Bikes,Car,Buses,Train,Airport,Sea port,Highway,Street,Ferries,Parking",
  "agriculture": "Nomadic Herding,Livestock Ranching,Shifting Cultivation,Rudimentary Sedentary Tillage, Subsistence Farming with Rice Dominant, Subsistence Farming without Rice Dominant, Commercial Plantations,Mediterranean Agriculture,Commercial Grain Farming,Livestock and Grain Farming,Subsistence Crop and Stock Farming,Dairy Framing,Specialized Horticulture",
  "green_infrastructure": "Park,Garden,Woodland,Tree line,Forest",
  "blue_infrastructure": "Dikes,Barrier walls"
};

$('#base_asset_subclass').on('change', function (e) {
  if ($("#base_asset_class").find("option:selected").attr('data-value') == 'residential') {
    myResidentialControl.update(0, 0);
  } else if ($("#base_asset_class").find("option:selected").attr('data-value') == 'hospitality') {
    myTourismControl.update(0, 0);
  } else if ($("#base_asset_class").find("option:selected").attr('data-value') == 'retail') {
    myRetailControl.update(0, 0);
  } else if ($("#base_asset_class").find("option:selected").attr('data-value') == 'office') {
    myOfficeControl.update(0, 0);
  } else if ($("#base_asset_class").find("option:selected").attr('data-value') == 'amenity') {
    myAmenityControl.update(0, 0);
  } else if ($("#base_asset_class").find("option:selected").attr('data-value') == 'mixuse') {
    myMixedUseControl.update(0, 0);
  } else if ($("#base_asset_class").find("option:selected").attr('data-value') == 'transport') {
    myTransportControl.update(0, 0);
  } else if ($("#base_asset_class").find("option:selected").attr('data-value') == 'community') {
    myCommunityControl.update(0, 0);
  }
});
$('#recompute_residential').on('click', function (e) {
  myResidentialControl.recompute();
  //your awesome code here
});
$('#recompute_tourism').on('click', function (e) {
  myTourismControl.recompute();
  //your awesome code here
});
$('#recompute_retail').on('click', function (e) {
  myRetailControl.recompute();
  //your awesome code here
});
$('#recompute_office').on('click', function (e) {
  myOfficeControl.recompute();
  //your awesome code here
});
$('#recompute_amenity').on('click', function (e) {
  myAmenityControl.recompute();
  //your awesome code here
});

$('#recompute_mixuse').on('click', function (e) {
  myMixedUseControl.recompute();
  //your awesome code here
});
$('#recompute_transport').on('click', function (e) {
  myTransportControl.recompute();
  //your awesome code here
});

$('#recompute_community').on('click', function (e) {
  myCommunityControl.recompute();
  //your awesome code here
});
$('#base_asset_class').on('change', function (e) {
  const key = $(this).find("option:selected").attr('data-value');
  updateClassControls(key);
});

function updateClassControls(base_class_type) {
  $(".usage_form").each(function (index) {
    $(this).removeClass("d-none");
    // $(this).hide();
  });

  var vals = [];
  $("#selected_typology_image").html('<small>No representative image specified, choose asset class and pick image.</small>');
  var filtered_images = [];
  // $("#base_asset_subclass_image").select2('destroy');
  $("#base_asset_subclass_image").empty();
  switch (base_class_type) {
    case 'residential':
      vals = data.residential.split(",");
      $(".usage_form").addClass('d-none');
      $("#built_env_form_residential").removeClass('d-none');
      $("#built_env_form_residential_secondary").removeClass('d-none');

      $(".services_form").removeClass('d-none');
      // $("#lu_chart_cont").removeClass('d-none');
      var $secondChoice = $("#base_asset_subclass");
      $secondChoice.empty();
      $secondChoice.append("<option selected disabled>Select Asset Subclass</option>");
      $.each(vals, function (index, value) {
        $secondChoice.append("<option >" + value + "</option>");
      });


      myResidentialControl.initialize();
      myResidentialControl.update(0, 0);
      break;
    case 'mixuse':
      vals = data.mixuse.split(",");
      $(".usage_form").addClass('d-none');
      $("#built_env_form_mixuse").removeClass('d-none');
      $("#built_env_form_mixuse_secondary").removeClass('d-none');

      $(".services_form").removeClass('d-none');
      // $("#lu_chart_cont").removeClass('d-none');
      var $secondChoice = $("#base_asset_subclass");
      $secondChoice.empty();
      $secondChoice.append("<option selected disabled>Select Asset Subclass</option>");
      $.each(vals, function (index, value) {
        $secondChoice.append("<option >" + value + "</option>");
      });


      myMixedUseControl.initialize();
      myMixedUseControl.update(0, 0);
      break;
    case 'hospitality':
      vals = data.hospitality.split(",");
      $(".usage_form").addClass('d-none');
      $("#built_env_form_tourism").removeClass('d-none');
      $("#built_env_form_tourism_secondary").removeClass('d-none');
      $(".services_form").removeClass('d-none');
      // $("#lu_chart_cont").removeClass('d-none');
      var $secondChoice = $("#base_asset_subclass");
      $secondChoice.empty();
      $secondChoice.append("<option selected disabled>Select Asset Subclass</option>");
      $.each(vals, function (index, value) {
        $secondChoice.append("<option >" + value + "</option>");
      });


      myTourismControl.initialize();
      myTourismControl.update();
      break;
    case 'retail':
      vals = data.retail.split(",");
      $(".usage_form").addClass('d-none');
      $(".services_form").removeClass('d-none');
      // $("#lu_chart_cont").removeClass('d-none');
      var $secondChoice = $("#base_asset_subclass");
      $secondChoice.empty();
      $secondChoice.append("<option selected disabled>Select Asset Subclass</option>");
      $.each(vals, function (index, value) {
        $secondChoice.append("<option >" + value + "</option>");
      });


      $("#built_env_form_retail").removeClass('d-none');
      $("#built_env_form_retail_secondary").removeClass('d-none');
      myRetailControl.initialize();
      myRetailControl.update();
      break;
    case 'office':
      vals = data.office.split(",");
      $(".usage_form").addClass('d-none');
      $(".services_form").removeClass('d-none');
      // $("#lu_chart_cont").removeClass('d-none');
      var $secondChoice = $("#base_asset_subclass");
      $secondChoice.empty();
      $secondChoice.append("<option selected disabled>Select Asset Subclass</option>");
      $.each(vals, function (index, value) {
        $secondChoice.append("<option >" + value + "</option>");
      });

      $("#built_env_form_office").removeClass('d-none');
      $("#built_env_form_office_secondary").removeClass('d-none');
      myOfficeControl.initialize();
      myOfficeControl.update();
      break;

    case 'amenity':
      vals = data.amenity.split(",");
      $(".usage_form").addClass('d-none');
      $(".services_form").removeClass('d-none');
      // $("#lu_chart_cont").removeClass('d-none');
      var $secondChoice = $("#base_asset_subclass");
      $secondChoice.empty();
      $secondChoice.append("<option selected disabled>Select Asset Subclass</option>");
      $.each(vals, function (index, value) {
        $secondChoice.append("<option >" + value + "</option>");
      });

      $("#built_env_form_amenity").removeClass('d-none');
      $("#built_env_form_amenity_secondary").removeClass('d-none');
      myAmenityControl.initialize();
      myAmenityControl.update();
      break;


    case 'transport':
      vals = data.transport.split(",");
      $(".usage_form").addClass('d-none');
      $("#built_env_form_transport").removeClass('d-none');
      $(".services_form").addClass('d-none');
      // $("#lu_chart_cont").addClass('d-none');

      var $secondChoice = $("#base_asset_subclass");
      $secondChoice.empty();
      $secondChoice.append("<option selected disabled>Select Asset Subclass</option>");
      $.each(vals, function (index, value) {
        $secondChoice.append("<option >" + value + "</option>");
      });

      myTransportControl.initialize();
      myTransportControl.update();
      break;
    case 'community':
      vals = data.community.split(",");
      $(".usage_form").addClass('d-none');
      $("#built_env_form_community").removeClass('d-none');

      $(".services_form").removeClass('d-none');
      // $("#lu_chart_cont").removeClass('d-none');
      var $secondChoice = $("#base_asset_subclass");
      $secondChoice.empty();
      $secondChoice.append("<option selected disabled>Select Asset Subclass</option>");
      $.each(vals, function (index, value) {
        $secondChoice.append("<option >" + value + "</option>");
      });

      myCommunityControl.initialize();
      myCommunityControl.update();
      break;
    // case 'green-infrastruture':
    //     vals = data.retail.split(",");
    //     $(".usage_form").addClass('d-none');
    //     $("#built_env_form_green-infrastructure").removeClass('d-none');
    //     break;

    case 'agriculture':
      vals = data.agriculture.split(",");
      $(".usage_form").addClass('d-none');
      $(".services_form").addClass('d-none');
      $("#lu_chart_cont").addClass('d-none');
      $("#built_env_form_agriculture").removeClass('d-none');
      var $secondChoice = $("#base_asset_subclass");
      $secondChoice.empty();
      $secondChoice.append("<option selected disabled>Select Asset Subclass</option>");
      $.each(vals, function (index, value) {
        $secondChoice.append("<option >" + value + "</option>");
      });

      break;

    case 'green_infrastructure':
      vals = data.green_infrastructure.split(",");
      $(".usage_form").addClass('d-none');
      $(".services_form").addClass('d-none');
      // $("#lu_chart_cont").addClass('d-none');
      $("#built_env_form_green_infrastructure").removeClass('d-none');
      var $secondChoice = $("#base_asset_subclass");
      $secondChoice.empty();
      $secondChoice.append("<option selected disabled>Select Asset Subclass</option>");
      $.each(vals, function (index, value) {
        $secondChoice.append("<option >" + value + "</option>");
      });

      break;

    case 'base':
      vals = ['Please choose from above'];
  }
  if (base_class_type == 'residential') {
    const res_filtered_images = all_images.filter(function (str) { return str.includes('residential') });
    const res_mix_filtered_images = all_images.filter(function (str) { return str.includes('mix') });
    filtered_images = res_filtered_images.concat(res_mix_filtered_images);

  }
  else if (base_class_type === 'retail' || base_class_type === 'office') {
    const commercial_filtered_images = all_images.filter(function (str) { return str.includes('commercial') });
    const mix_filtered_images = all_images.filter(function (str) { return str.includes('mix') });
    filtered_images = commercial_filtered_images.concat(mix_filtered_images);


  }
  else if (base_class_type === 'mixuse' || base_class_type === 'office') {
    filtered_images = all_images.filter(function (str) { return str.includes('mix') });

  }
  else if (base_class_type === 'transport') {
    filtered_images = all_images.filter(function (str) { return str.includes('transport') });

  }
  else if (base_class_type === 'hospitality'|| base_class_type === 'amenity') {
    const tourism_filtered_images = all_images.filter(function (str) { return str.includes('tourism') });
    const com_filtered_images = all_images.filter(function (str) { return str.includes('commercial') });
    filtered_images = tourism_filtered_images.concat(com_filtered_images);
  }

  // else if (base_class_type ==='community') {
  // filtered_images =  all_images.filter(function (str) { return str.includes('community')});
  // }

  var d = [];

  for (let i9 = 0; i9 < filtered_images.length; i9++) {
    var d1 = [];
    const element = filtered_images[i9];
    d1['id'] = i9;
    d1['base_class'] = base_class_type;
    d1['image_path'] = element;
    d1['text'] = "<span><img src='assets/img/asset-images/thumbnails/" + element + "' /></span>";
    d.push(d1);
  };
 
  $("#base_asset_subclass_image").select2({
    minimumResultsForSearch: -1,
    placeholder: "Select a image",
    data: d,
    templateResult: function (d) { return $(d.text); },
    templateSelection: function (d) { return $(d.base_class); },

  });

 
  $('#base_asset_subclass_image').on('select2:select', function (e) {
    var data = e.params.data;
    const image_path = data['image_path'];
    representative_image = image_path;
    $("#selected_typology_image").html("<img src='assets/img/asset-images/" + image_path + "'/>");


  });

}

var ResidentialCalaulator = function () {
  this.generateResidentialUnits = function (diagramArea, sysName, sysTag) {

    var whiteListedSysName = ['HDH', 'LDH', 'IND', 'COM', 'COMIND', 'HSNG', 'HSG', 'MXD'];

    var COMBuilding = function () {
      const elevationoffset = 1;
      const comHeights = [14, 25, 30, 22, 28];
      const floorHeight = 5;
      const avgUnitsize = 50;

      this.generateUnits = function (area) {
        var height = elevationoffset + comHeights[Math.floor(Math.random() * comHeights
          .length)];
        var numFloors = Math.round(height / floorHeight); // 5 meter per floor
        var numUnitsperFloor = Math.round(area / avgUnitsize);
        var totalUnits = numUnitsperFloor * numFloors;
        return totalUnits;
      };
    }

    var LDHousing = function () {
      const elevationoffset = 1;
      const ldhHeights = [1, 2, 3];
      const floorHeight = 5;
      const avgUnitsize = 100;

      this.generateUnits = function (area) {
        var height = elevationoffset + ldhHeights[Math.floor(Math.random() * ldhHeights
          .length)];
        var numFloors = Math.round(height / floorHeight); // 5 meter per floor
        var numUnitsperFloor = Math.round(area / avgUnitsize);
        var totalUnits = numUnitsperFloor * numFloors;
        return totalUnits;
      };
    }

    var HDHousing = function () {
      const elevationoffset = 1;
      const hdhHeights = [36, 60, 90]; // in meters 
      const floorHeight = 5;
      const avgUnitsize = 50;

      this.generateUnits = function (area) {
        var height = elevationoffset + hdhHeights[Math.floor(Math.random() * hdhHeights
          .length)];
        var numFloors = Math.round(height / floorHeight); // 5 meter per floor
        var numUnitsperFloor = Math.round(area / avgUnitsize);
        var totalUnits = numUnitsperFloor * numFloors;
        return totalUnits;
      };
    }

    var MXDBuildings = function () {
      const elevationoffset = 1;
      const mxdHeights = [9, 12, 8, 11]; // in meters 
      const floorHeight = 5;
      const avgUnitsize = 75;

      this.generateUnits = function (area) {
        var height = elevationoffset + mxdHeights[Math.floor(Math.random() * mxdHeights
          .length)];
        var numFloors = Math.round(height / floorHeight); // 5 meter per floor
        var numUnitsperFloor = Math.round(area / avgUnitsize);
        var totalUnits = numUnitsperFloor * numFloors;
        return totalUnits;
      };
    }

    var LABBuildings = function () {
      const elevationoffset = 1;
      var labHeights = [10, 15];
      const floorHeight = 5;
      const avgUnitsize = 100;

      this.generateUnits = function (area) {
        var height = elevationoffset + labHeights[Math.floor(Math.random() * labHeights
          .length)];
        var numFloors = Math.round(height / floorHeight); // 5 meter per floor
        var numUnitsperFloor = Math.round(area / avgUnitsize);
        var totalUnits = numUnitsperFloor * numFloors;
        return totalUnits;
      };
    }

    var SMBBuildings = function () {
      const elevationoffset = 1;
      var smbHeights = [2, 3, 5, 6, 7, 10];
      const floorHeight = 5;
      const avgUnitsize = 75;

      this.generateUnits = function (area) {
        var height = elevationoffset + smbHeights[Math.floor(Math.random() * smbHeights
          .length)];
        var numFloors = Math.round(height / floorHeight); // 5 meter per floor
        var numUnitsperFloor = Math.round(area / avgUnitsize);
        var totalUnits = numUnitsperFloor * numFloors;
        return totalUnits;
      };
    }


    if (whiteListedSysName.indexOf(sysName) >= 0) { // system is whitelisted
      if ((sysName === 'HDH') || (sysName === 'HSNG') || (sysName === 'HSG')) {

        var hdh = new HDHousing();
        units = hdh.generateUnits(diagramArea);
      } else if (sysName === 'MXD') {


        var mxd = new MXDBuildings();
        var units = mxd.generateUnits(diagramArea);
      } else if (sysName === 'LDH') {
        var ldh = new LDHousing();
        units = ldh.generateUnits(diagramArea);

      } else if ((sysName === 'COM') || (sysName === 'COMIND') || (sysName === 'IND')) {
        var com = new COMBuilding();
        units = com.generateUnits(diagramArea);

      }
    } else if ((sysTag === 'Large buildings, Industry, commerce')) { // system not whitelisted
      var lab = new LABBuildings();
      units = lab.generateUnits(diagramArea);

    } else if ((sysTag === 'Small buildings, low density housing')) { // system not whitelisted 
      var smb = new SMBBuildings();
      units = smb.generateUnits(diagramArea);
      // yeild = 16;
    } else {
      units = 0;
      // yeild = 12; // default yeild
    }
    return units;
  }

  $('.editable').on('shown', function () {
    $('.popover.show.editable-container').popover('update');
});

  this.initcompute = function () {
    const numresidences = parseInt($("#residential_units").editable('getValue', true));
    const population = parseInt($("#number_of_people_residential").editable('getValue', true));
    const floors = parseInt($("#residential_floors").editable('getValue', true));
    const far = parseInt($("#residential_far").editable('getValue', true));
    // const population = $('#number_of_people_residential').editable('setValue', numresidences * 4);
    this.update(numresidences, population, floors, far);

  }
  this.initialize = function () {

    $('#residential_units').editable({
      'mode': 'inline',
      validate: function (value) {
        if ($.trim(value) == '') {
          return 'This field is required';
        } else if ($.isNumeric(value) == '') {
          return "Input must be a integer"
        }
      }
    });


    $('#residential_floors').editable({
      'mode': 'inline',
      validate: function (value) {
        if ($.trim(value) == '') {
          return 'This field is required';
        } else if ($.isNumeric(value) == '') {
          return "Input must be a integer"
        }
      }
    });


    $('#residential_far').editable({
      'mode': 'inline',
      validate: function (value) {
        if ($.trim(value) == '') {
          return 'This field is required';
        } else if ($.isNumeric(value) == '') {
          return "Input must be a decimal"
        }
      }
    });

    $('#number_of_people_residential').editable({
      'mode': 'inline',
      validate: function (value) {
        if ($.trim(value) == '') {
          return 'This field is required';
        } else if ($.isNumeric(value) == '') {
          return "Input must be a integer"
        }
      }
    });

  }
  this.recompute = function () {
    myDisplayUpdater = new ServicesDisplayUpdater();
    const numresidences = parseInt($("#residential_units").editable('getValue', true));
    const population = parseInt($("#number_of_people_residential").editable('getValue', true));
    const floors = parseInt($("#residential_floors").editable('getValue', true));

    const far = parseFloat($("#residential_far").editable('getValue', true));


    var diagram_area = diagramdetail['area'];
    const area_in_km2 = (diagram_area / 1000000);
    const max_buildable_area_in_m2 = (diagram_area * floors);
    const new_population_density = population / area_in_km2;
    const total_floor_area_residential_available = parseInt((diagram_area * far * floors));
    const max_floor_area_available_per_floor = parseInt((diagram_area * far));
    const residences_per_floor = numresidences / floors;

    const total_floor_area_residential_available_per_floor = parseInt((total_floor_area_residential_available / floors));
    const avg_area_per_unit = (parseInt(total_floor_area_residential_available_per_floor) / parseInt(numresidences));

    $("#current_pop_density").html(abbrNum(new_population_density, 2));
    $("#total_floor_area_residential_built").html(abbrNum(total_floor_area_residential_available, 2));
    $("#total_floor_area_residential_available").html(abbrNum(max_buildable_area_in_m2, 2));
    $("#avg_area_per_unit").html(abbrNum(parseInt(avg_area_per_unit), 2) + ' m2 / ' + abbrNum(total_floor_area_residential_available_per_floor, 2) + '<small>m2 per floor</small>');

    myDisplayUpdater.updateBedsRecompute(population);
    myDisplayUpdater.updatePoliceStationsRecompute(population);
    myDisplayUpdater.updateFireStationsRecompte(population);
    myDisplayUpdater.updateSchoolsRecompute(population * 0.05);
    myDisplayUpdater.updateEnergyRecompute(population);
    myDisplayUpdater.updateWaterRecompute(population);
    myDisplayUpdater.updateSewageRecompute(population);
    const total_parking_area = myDisplayUpdater.updateTransportRecompute(population, 2, 2);
    const total_green_space_area = myDisplayUpdater.updateGreenSpaceRecompute(population);
    // const lu_chart_data = {"area_available":max_buildable_area_in_m2, "built_up_area":total_floor_area_residential_available, "green_space":total_green_space_area[0], "parking":total_parking_area[0]};
    // populate_lu_chart('residential', lu_chart_data);

  }
  this.update = function (units, population, floors) {
    const residential_class_defaults = {
      "Luxury": {
        "beds": 0.0025,
        "police_stations": 0.0025,
        "fire_stations": 0.0025,
        "schools": 4,
        "energy": 14,
        "water": 50,
        "sewage": 102,
        "transport": {
          'road': 0.9,
          'rail': 0.1
        },
        "far": 0.6,
        "green_space": 9,
        "parking_demand": 0.5
      },
      "High Priced": {
        "beds": 0.0025,
        "police_stations": 0.0025,
        "fire_stations": 0.0025,
        "schools": 4,
        "energy": 14,
        "water": 50,
        "sewage": 102,
        "transport": {
          'road': 0.9,
          'rail': 0.1
        },
        "far": 0.6,
        "green_space": 9,
        "parking_demand": 0.5
      },
      "Mid Priced": {
        "beds": 0.0035,
        "police_stations": 0.0035,
        "fire_stations": 0.0035,
        "schools": 5,
        "energy": 12.8,
        "water": 50,
        "sewage": 82,
        "transport": {
          'road': 0.3,
          'rail': 0.7
        },
        "far": 0.6,
        "green_space": 9,
        "parking_demand": 0.5
      },
      "Low Priced": {
        "beds": 0.0045,
        "police_stations": 0.0045,
        "fire_stations": 0.0045,
        "schools": 7,
        "energy": 10,
        "water": 50,
        "sewage": 72,
        "transport": {
          'road': 0.4,
          'rail': 0.6
        },
        "far": 0.6,
        "green_space": 9,
        "parking_demand": 0.5
      },
      "Affordable Housing": {
        "beds": 0.0055,
        "police_stations": 0.0055,
        "fire_stations": 0.0055,
        "schools": 10,
        "energy": 8,
        "water": 30,
        "sewage": 60,
        "transport": {
          'road': 0.5,
          'rail': 0.5
        },
        "far": 0.6,
        "green_space": 9,
        "parking_demand": 0.5
      },
      "Full Rennovation": {
        "beds": 0.0055,
        "police_stations": 0.0055,
        "fire_stations": 0.0055,
        "schools": 10,
        "energy": 8,
        "water": 30,
        "sewage": 60,
        "transport": {
          'road': 0.5,
          'rail': 0.5
        },
        "far": 0.6,
        "green_space": 9,
        "parking_demand": 0.5
      },
      "Medium Rennovation": {
        "beds": 0.0055,
        "police_stations": 0.0055,
        "fire_stations": 0.0055,
        "schools": 10,
        "energy": 8,
        "water": 30,
        "sewage": 60,
        "transport": {
          'road': 0.5,
          'rail': 0.5
        },
        "far": 0.6,
        "green_space": 9,
        "parking_demand": 0.5
      },
      "Low Rennovation": {
        "beds": 0.0055,
        "police_stations": 0.0055,
        "fire_stations": 0.0055,
        "schools": 10,
        "energy": 8,
        "water": 20,
        "sewage": 60,
        "transport": {
          'road': 0.5,
          'rail': 0.5
        },
        "far": 0.6,
        "green_space": 9,
        "parking_demand": 0.5
      }
    };


    myDisplayUpdater = new ServicesDisplayUpdater();

    var system_id = diagramdetail['sysid'];
    var diagram_area = diagramdetail['area'];
    var system_tag = systemdetail['systag'];
    var system_name = systemdetail['sysname'];

    if (units === 0 && population === 0) {
      units = myResidentialControl.generateResidentialUnits(diagram_area, system_name, system_tag);
      population = units * 4;
      floors = 1
    }


    var selected_subclass = $("#base_asset_subclass").val();

    selected_subclass = (selected_subclass) ? selected_subclass : 'Mid Priced';
    const total_floor_area_residential_available = abbrNum(parseInt((diagram_area * residential_class_defaults[selected_subclass]['far'] * floors)),
      2)

    $("#total_floor_area_residential_available").html(total_floor_area_residential_available);
    $("#residential_units").editable('setValue', units);
    $("#number_of_people_residential").editable('setValue', population);

    const area_in_km2 = (diagram_area / 1000000);
    const new_population_density = population / area_in_km2;

    $("#current_pop_density").html(abbrNum(new_population_density, 2));

    myDisplayUpdater.updateBeds(population, residential_class_defaults[selected_subclass]['beds']);
    myDisplayUpdater.updatePoliceStations(population, residential_class_defaults[selected_subclass]
    ['police_stations']);
    myDisplayUpdater.updateFireStations(population, residential_class_defaults[selected_subclass][
      'fire_stations'
    ]);
    myDisplayUpdater.updateSchools(population * 0.05, residential_class_defaults[selected_subclass]
    ['schools']);
    myDisplayUpdater.updateEnergy(population, residential_class_defaults[selected_subclass][
      'energy'
    ]);
    myDisplayUpdater.updateWater(population, residential_class_defaults[selected_subclass]['water']);
    myDisplayUpdater.updateSewage(population, residential_class_defaults[selected_subclass][
      'sewage'
    ]);
    myDisplayUpdater.updateTransport(population, residential_class_defaults[selected_subclass]['transport']['road'], residential_class_defaults[selected_subclass]['transport']['rail'], 2, 2, 0.5);

    myDisplayUpdater.updateGreenSpace(population, residential_class_defaults[selected_subclass]['green_space']);

    myDisplayUpdater.updateParking(population * .5, residential_class_defaults[selected_subclass]['parking_demand']);

  }
}

var TourismDisplayUpdater = function () {

  this.updateRooms = function (area) {
    const land_area = $("#tourism_land_area").editable('getValue', true);
    const floors = $("#tourism_floors").editable('getValue', true);
    const m2_per_guest = $("#tourism_m2_per_guest").editable('getValue', true);
    const people_per_room = $("#tourism_people_per_room").editable('getValue', true);

    const rooms = (area / (people_per_room * m2_per_guest * land_area)) * floors;
    $("#tourism_total_rooms").html(parseInt(rooms));
    return rooms;
  }

  this.updateEmployment = function (total_daily_visitors) {

    const direct_employees_to_visitor_ratio_tourism = $("#direct_employees_to_visitor_ratio_tourism").editable('getValue', true);
    const indirect_to_direct_employees_ratio_tourism = $("#indirect_to_direct_employees_ratio_tourism").editable('getValue', true);
    $("#total_direct_employment_tourism").html(parseInt(direct_employees_to_visitor_ratio_tourism * total_daily_visitors));
    $("#total_indirect_employment_tourism").html(parseInt(indirect_to_direct_employees_ratio_tourism * total_daily_visitors));

  }
}

var TourismCalaulator = function () {

  this.initialize = function () {

    $('#tourism_m2_per_guest').editable({
      'mode': 'inline',
      validate: function (value) {
        if ($.trim(value) == '') {
          return 'This field is required';
        } else if ($.isNumeric(value) == '') {
          return "Input must be a integer"
        }
      }
    });

    $('#tourism_people_per_room').editable({
      'mode': 'inline',
      validate: function (value) {
        if ($.trim(value) == '') {
          return 'This field is required';
        } else if ($.isNumeric(value) == '') {
          return "Input must be a integer"
        }
      }
    });

    $('#tourism_floors').editable({
      'mode': 'inline',
      validate: function (value) {
        if ($.trim(value) == '') {
          return 'This field is required';
        } else if ($.isNumeric(value) == '') {
          return "Input must be a integer"
        }
      }
    });

    $('#tourism_land_area').editable({
      'mode': 'inline',
      validate: function (value) {
        if ($.trim(value) == '') {
          return 'This field is required';
        } else if ($.isNumeric(value) == '') {
          return "Input must be a integer"
        }
      }
    });

    $('#target_occupancy_rate').editable({
      'mode': 'inline',
      validate: function (value) {
        if ($.trim(value) == '') {
          return 'This field is required';
        } else if ($.isNumeric(value) == '') {
          return "Input must be a integer"
        }
      }
    });

    $('#indirect_to_direct_employees_ratio_tourism').editable({
      'mode': 'inline',
      validate: function (value) {
        if ($.trim(value) == '') {
          return 'This field is required';
        } else if ($.isNumeric(value) == '') {
          return "Input must be a integer"
        }
      }
    });

    $('#direct_employees_to_visitor_ratio_tourism').editable({
      'mode': 'inline',
      validate: function (value) {
        if ($.trim(value) == '') {
          return 'This field is required';
        } else if ($.isNumeric(value) == '') {
          return "Input must be a integer"
        }
      }
    });


  }
  this.recompute = function () {

    const diagram_area = diagramdetail['area']
    myDisplayUpdater = new TourismDisplayUpdater();
    const m2_per_guest = parseInt($("#tourism_m2_per_guest").editable("getValue", true));
    const floors = parseInt($("#tourism_floors").editable("getValue", true));
    const land_area = parseInt($("#tourism_land_area").editable("getValue", true));
    const target_occupancy_rate = parseFloat($("#target_occupancy_rate").editable('getValue', true));
    const people_per_room = parseInt($("#tourism_people_per_room").editable('getValue', true));

    const rooms = myTourismDisplayUpdater.updateRooms(diagram_area);


    const direct_employees_to_visitor_ratio_tourism = $("#direct_employees_to_visitor_ratio_tourism").editable('getValue', true);
    const indirect_to_direct_employees_ratio_tourism = $("#indirect_to_direct_employees_ratio_tourism").editable('getValue', true);

    $("#tourism_total_rooms").html(parseInt(rooms));
    const daily_visitors = rooms * target_occupancy_rate * people_per_room;
    const yearly_visitors = daily_visitors * 365;

    $("#total_yearly_visitors").html(abbrNum(parseInt(yearly_visitors),2));
    $("#total_daily_visitors").html(abbrNum(parseInt(daily_visitors),2));

    $("#total_direct_employment_tourism").html(parseInt(direct_employees_to_visitor_ratio_tourism * daily_visitors));
    $("#total_indirect_employment_tourism").html(parseInt(indirect_to_direct_employees_ratio_tourism * daily_visitors));


    myDisplayUpdater = new ServicesDisplayUpdater();

    myDisplayUpdater.updateBedsRecompute(yearly_visitors);
    myDisplayUpdater.updatePoliceStationsRecompute(yearly_visitors);
    myDisplayUpdater.updateFireStationsRecompte(yearly_visitors);
    myDisplayUpdater.updateSchoolsRecompute(yearly_visitors * 0.05);
    myDisplayUpdater.updateEnergyRecompute(yearly_visitors);
    myDisplayUpdater.updateWaterRecompute(yearly_visitors);
    myDisplayUpdater.updateSewageRecompute(yearly_visitors);

    const land_usage = myDisplayUpdater.updateLandUsageRecompute(diagram_area);
    const green_space = myDisplayUpdater.updateGreenSpaceRecompute(daily_visitors);

    // const lu_chart_data = {"area_available":diagram_area, "built_up_area":land_usage, "green_space":green_space[0], "parking":0};    

    // populate_lu_chart('tourism', lu_chart_data);

  }
  this.update = function () {

    const tourism_class_defaults = {
      "Luxury": {
        "tourism_m2_per_guest": 60,
        "tourism_floors": 2,
        "tourism_land_area": 3,
        "target_occupancy_rate": .70,
        "people_per_room": 3,
        "avg_length_of_stay": 2,
        "beds": 0.0045,
        "police_stations": 0.0045,
        "fire_stations": 0.0045,
        "schools": 0,
        "energy": 14,
        "water": 220,
        "direct_employees_to_visitor_ratio": 2,
        "indirect_to_direct_employees_ratio": .05,
        "sewage": 102,
        "transport": {
          'road': 0.9,
          'rail': 0.1
        },
        "green_space": 3,
        "parking_demand": 0.5
      },
      "Upscale Hotel": {
        "tourism_m2_per_guest": 50,
        "tourism_floors": 4,
        "tourism_land_area": 2.7,
        "target_occupancy_rate": .70,
        "people_per_room": 2,
        "avg_length_of_stay": 2,
        "beds": 0.0045,
        "police_stations": 0.0045,
        "fire_stations": 0.0045,
        "schools": 0,
        "energy": 14,
        "direct_employees_to_visitor_ratio": 0.5,
        "indirect_to_direct_employees_ratio": .05,
        "water": 220,
        "sewage": 102,
        "transport": {
          'road': 0.9,
          'rail': 0.1
        },
        "green_space": 3,
        "parking_demand": 0.5
      },
      "Midscale Hotel": {
        "tourism_m2_per_guest": 40,
        "tourism_floors": 5,
        "tourism_land_area": 2,
        "target_occupancy_rate": .70,
        "people_per_room": 3,
        "avg_length_of_stay": 4,
        "beds": 0.0045,
        "direct_employees_to_visitor_ratio": 0.25,
        "indirect_to_direct_employees_ratio": .05,
        "police_stations": 0.0045,
        "fire_stations": 0.0045,
        "schools": 0,
        "energy": 14,
        "water": 220,
        "sewage": 102,
        "transport": {
          'road': 0.9,
          'rail': 0.1
        },
        "green_space": 3,
        "parking_demand": 0.5
      },
      "Budget Hotel": {
        "tourism_m2_per_guest": 30,
        "tourism_floors": 6,
        "tourism_land_area": 1.5,
        "target_occupancy_rate": .75,
        "people_per_room": 1,
        "avg_length_of_stay": 1,
        "beds": 0.0045,
        "police_stations": 0.0045,
        "direct_employees_to_visitor_ratio": 0.1,
        "indirect_to_direct_employees_ratio": .05,
        "fire_stations": 0.0045,
        "schools": 0,
        "energy": 14,
        "water": 220,
        "sewage": 102,
        "transport": {
          'road': 0.9,
          'rail': 0.1
        },
        "green_space": 3,
        "parking_demand": 0.5
      },
      "Full Rennovation": {
        "tourism_m2_per_guest": 30,
        "tourism_floors": 6,
        "tourism_land_area": 1.5,
        "target_occupancy_rate": .75,
        "people_per_room": 1,
        "avg_length_of_stay": 1,
        "beds": 0.0045,
        "police_stations": 0.0045,
        "direct_employees_to_visitor_ratio": 0.1,
        "indirect_to_direct_employees_ratio": .05,
        "fire_stations": 0.0045,
        "schools": 0,
        "energy": 14,
        "water": 220,
        "sewage": 102,
        "transport": {
          'road': 0.9,
          'rail': 0.1
        },
        "green_space": 3,
        "parking_demand": 0.5
      },
      "Medium Rennovation": {
        "tourism_m2_per_guest": 30,
        "tourism_floors": 6,
        "tourism_land_area": 1.5,
        "target_occupancy_rate": .75,
        "people_per_room": 1,
        "avg_length_of_stay": 1,
        "beds": 0.0045,
        "police_stations": 0.0045,
        "direct_employees_to_visitor_ratio": 0.1,
        "indirect_to_direct_employees_ratio": .05,
        "fire_stations": 0.0045,
        "schools": 0,
        "energy": 14,
        "water": 220,
        "sewage": 102,
        "transport": {
          'road': 0.9,
          'rail': 0.1
        },
        "green_space": 3,
        "parking_demand": 0.5
      },
      "Low Rennovation": {
        "tourism_m2_per_guest": 30,
        "tourism_floors": 6,
        "tourism_land_area": 1.5,
        "target_occupancy_rate": .75,
        "people_per_room": 1,
        "avg_length_of_stay": 1,
        "beds": 0.0045,
        "police_stations": 0.0045,
        "direct_employees_to_visitor_ratio": 0.1,
        "indirect_to_direct_employees_ratio": .05,
        "fire_stations": 0.0045,
        "schools": 0,
        "energy": 14,
        "water": 220,
        "sewage": 102,
        "transport": {
          'road': 0.9,
          'rail': 0.1
        },
        "green_space": 3,
        "parking_demand": 0.5
      }
    };


    myTourismDisplayUpdater = new TourismDisplayUpdater();
    var diagram_area = diagramdetail['area'];
    var rooms = myTourismDisplayUpdater.updateRooms(diagram_area);

    var selected_subclass = $("#base_asset_subclass").val();
    selected_subclass = (selected_subclass) ? selected_subclass : 'Midscale Hotel';

    $("#tourism_m2_per_guest").editable('setValue', tourism_class_defaults[selected_subclass]["tourism_m2_per_guest"]);
    $("#tourism_floors").editable('setValue', tourism_class_defaults[selected_subclass]["tourism_floors"]);
    $("#tourism_people_per_room").editable('setValue', tourism_class_defaults[selected_subclass]["people_per_room"]);
    $("#tourism_land_area").editable('setValue', tourism_class_defaults[selected_subclass]["tourism_land_area"]);
    $("#target_occupancy_rate").editable('setValue', tourism_class_defaults[selected_subclass]["target_occupancy_rate"]);
    $('#direct_employees_to_visitor_ratio_tourism').editable('setValue', tourism_class_defaults[selected_subclass]["direct_employees_to_visitor_ratio"]);
    $('#indirect_to_direct_employees_ratio_tourism').editable('setValue', tourism_class_defaults[selected_subclass]["indirect_to_direct_employees_ratio"]);

    const population = rooms * tourism_class_defaults[selected_subclass]["target_occupancy_rate"] * tourism_class_defaults[selected_subclass]["people_per_room"] * 365;
    const daily_population = population / 365;
    $("#total_yearly_visitors").html(parseInt(population));

    $("#total_daily_visitors").html(parseInt(daily_population));

    myTourismDisplayUpdater.updateEmployment(population);
    myDisplayUpdater = new ServicesDisplayUpdater();
    myDisplayUpdater.updateBeds(population, tourism_class_defaults[selected_subclass]['beds']);
    myDisplayUpdater.updatePoliceStations(population, tourism_class_defaults[selected_subclass]['police_stations']);
    myDisplayUpdater.updateFireStations(population, tourism_class_defaults[selected_subclass]['fire_stations']);
    myDisplayUpdater.updateSchools(population * 0.05, tourism_class_defaults[selected_subclass]['schools']);
    myDisplayUpdater.updateEnergy(population, tourism_class_defaults[selected_subclass]['energy']);
    myDisplayUpdater.updateWater(population, tourism_class_defaults[selected_subclass]['water']);
    myDisplayUpdater.updateSewage(population, tourism_class_defaults[selected_subclass]['sewage']);
    const total_parking_area = myDisplayUpdater.updateTransport(population, tourism_class_defaults[selected_subclass]['transport']['road'], tourism_class_defaults[selected_subclass]['transport']['rail'], 2, 2);
    const total_green_space_area = myDisplayUpdater.updateGreenSpace(population, tourism_class_defaults[selected_subclass]['green_space']);
    myDisplayUpdater.updateParking(population * .5, tourism_class_defaults[selected_subclass][
      'parking_demand'
    ]);

  }
}

var RetailCalaulator = function () {
  this.initialize = function () {
    $('#retail_m2_per_visitor').editable({
      'mode': 'inline',
      validate: function (value) {
        if ($.trim(value) == '') {
          return 'This field is required';
        } else if ($.isNumeric(value) == '') {
          return "Input must be a integer"
        }
      }
    });

    $('#retail_floors').editable({
      'mode': 'inline',
      validate: function (value) {
        if ($.trim(value) == '') {
          return 'This field is required';
        } else if ($.isNumeric(value) == '') {
          return "Input must be a integer"
        }
      }
    });

    $('#total_daily_visitors_retail').editable({
      'mode': 'inline',
      validate: function (value) {
        if ($.trim(value) == '') {
          return 'This field is required';
        } else if ($.isNumeric(value) == '') {
          return "Input must be a integer"
        }
      }
    });

    $('#percent_interested_in_luxury_retail').editable({
      'mode': 'inline',
      validate: function (value) {
        if ($.trim(value) == '') {
          return 'This field is required';
        } else if ($.isNumeric(value) == '') {
          return "Input must be a integer"
        }
      }
    });

    $('#percent_interested_in_support_retail').editable({
      'mode': 'inline',
      validate: function (value) {
        if ($.trim(value) == '') {
          return 'This field is required';
        } else if ($.isNumeric(value) == '') {
          return "Input must be a integer"
        }
      }
    });

    $('#percent_interested_in_fmcg_retail').editable({
      'mode': 'inline',
      validate: function (value) {
        if ($.trim(value) == '') {
          return 'This field is required';
        } else if ($.isNumeric(value) == '') {
          return "Input must be a integer"
        }
      }
    });
    $('#percent_interested_in_food_retail').editable({
      'mode': 'inline',
      validate: function (value) {
        if ($.trim(value) == '') {
          return 'This field is required';
        } else if ($.isNumeric(value) == '') {
          return "Input must be a integer"
        }
      }
    });
    $('#direct_employees_to_visitor_ratio_retail').editable({
      'mode': 'inline',
      validate: function (value) {
        if ($.trim(value) == '') {
          return 'This field is required';
        } else if ($.isNumeric(value) == '') {
          return "Input must be a integer"
        }
      }
    });
    $('#indirect_to_direct_employees_ratio_retail').editable({
      'mode': 'inline',
      validate: function (value) {
        if ($.trim(value) == '') {
          return 'This field is required';
        } else if ($.isNumeric(value) == '') {
          return "Input must be a integer"
        }
      }
    });


  }
  this.recompute = function () {
    const diagram_area = diagramdetail['area']

    const retail_m2_per_visitor = $("#retail_m2_per_visitor").editable('getValue', true);
    const total_daily_visitors = $("#total_daily_visitors_retail").editable('getValue', true);
    const number_of_floors = $("#retail_floors").editable('getValue', true);
    const percent_interested_luxury = $("#percent_interested_in_luxury_retail").editable('getValue',
      true);
    const percent_interested_support = $("#percent_interested_in_support_retail").editable(
      'getValue', true);
    const percent_interested_fmcg = $("#percent_interested_in_fmcg_retail").editable('getValue',
      true);
    const percent_interested_food = $("#percent_interested_in_food_retail").editable('getValue',
      true);

    const direct_employees_to_visitor_ratio_retail = $("#direct_employees_to_visitor_ratio_retail").editable('getValue', true);
    const indirect_to_direct_employees_ratio_retail = $("#indirect_to_direct_employees_ratio_retail").editable('getValue', true);
    const total_floor_area_luxury = (retail_m2_per_visitor * total_daily_visitors *
      percent_interested_luxury);
    const total_floor_area_support = (retail_m2_per_visitor * total_daily_visitors *
      percent_interested_support);
    const total_floor_area_fmcg = (retail_m2_per_visitor * total_daily_visitors *
      percent_interested_fmcg);
    const total_floor_area_other = (retail_m2_per_visitor * total_daily_visitors *
      percent_interested_food);

    const total_floor_area_retail = (total_floor_area_luxury + total_floor_area_support +
      total_floor_area_fmcg + total_floor_area_other);
    $("#total_floor_area_retail_luxury_split").html(abbrNum(parseInt(total_floor_area_luxury), 2));
    $("#total_floor_area_retail_support_split").html(abbrNum(parseInt(total_floor_area_support), 2));
    $("#total_floor_area_retail_fmcg_split").html(abbrNum(parseInt(total_floor_area_fmcg), 2));
    $("#total_floor_area_retail_other_split").html(abbrNum(parseInt(total_floor_area_other), 2));
    const total_floor_area_retail_available = diagram_area * 0.8 * number_of_floors;
    $("#total_floor_area_retail_required").html(abbrNum(parseInt(total_floor_area_retail), 2));


    $("#total_floor_area_retail_available").html(abbrNum(parseInt(total_floor_area_retail_available), 2)); // only 80% of the area is available, rest for frontage etc. 

    $("#total_direct_employment_retail").html(parseInt(direct_employees_to_visitor_ratio_retail * total_daily_visitors));
    $("#total_indirect_employment_retail").html(parseInt(indirect_to_direct_employees_ratio_retail * total_daily_visitors));

    myDisplayUpdater = new ServicesDisplayUpdater();

    myDisplayUpdater.updateBedsRecompute(total_daily_visitors);
    myDisplayUpdater.updatePoliceStationsRecompute(total_daily_visitors);
    myDisplayUpdater.updateFireStationsRecompte(total_daily_visitors);
    myDisplayUpdater.updateSchoolsRecompute(total_daily_visitors * 0.05);
    myDisplayUpdater.updateEnergyRecompute(total_daily_visitors);
    myDisplayUpdater.updateWaterRecompute(total_daily_visitors);
    myDisplayUpdater.updateSewageRecompute(total_daily_visitors);
    // const total_parking_area  =  myDisplayUpdater.updateTransportRecompute(total_daily_visitors, 2, 2);                
    const total_green_space_area = myDisplayUpdater.updateGreenSpaceRecompute(total_daily_visitors);
    const total_parking_area = myDisplayUpdater.updateParkingRecompute(total_daily_visitors * 0.5);
    // const lu_chart_data = {"area_available":total_floor_area_retail_available, "built_up_area":total_floor_area_retail, "green_space":total_green_space_area[0], "parking":total_parking_area};               
    // populate_lu_chart('retail', lu_chart_data);

  }
  this.update = function () {

    const retail_class_defaults = {
      "New Build": {
        "retail_m2_per_visitor": 12,
        "total_daily_visitors_retail": 2000,
        "retail_floors": 2,
        "percent_interested_in_luxury_retail": .1,
        "percent_interested_in_support_retail": .2,
        "percent_interested_in_fmcg_retail": .5,
        "percent_interested_in_food_retail": .2,
        "beds": 0.0045,
        "police_stations": 0.0045,
        "fire_stations": 0.0045,
        "schools": 0,
        "energy": 14,
        "water": 220,
        "sewage": 102,
        "transport": {
          'road': 0.9,
          'rail': 0.1
        },

        "green_space": 1,
        "parking_demand": 0.5
      },
      "Full Rennovation": {
        "retail_m2_per_visitor": 11,
        "total_daily_visitors_retail": 1500,
        "retail_floors": 2,
        "percent_interested_in_luxury_retail": .1,
        "percent_interested_in_support_retail": .2,
        "percent_interested_in_fmcg_retail": .5,
        "percent_interested_in_food_retail": .2,
        "beds": 0.0045,
        "police_stations": 0.0045,
        "fire_stations": 0.0045,
        "schools": 0,
        "energy": 14,
        "water": 220,
        "sewage": 102,
        "transport": {
          'road': 0.9,
          'rail': 0.1
        },

        "green_space": 1,
        "parking_demand": 0.5
      },
      "Medium Rennovation": {
        "retail_m2_per_visitor": 10,
        "total_daily_visitors_retail": 1100,
        "retail_floors": 2,
        "percent_interested_in_luxury_retail": .1,
        "percent_interested_in_support_retail": .2,
        "percent_interested_in_fmcg_retail": .5,
        "percent_interested_in_food_retail": .2,
        "beds": 0.0045,
        "police_stations": 0.0045,
        "fire_stations": 0.0045,
        "schools": 0,
        "energy": 14,
        "water": 220,
        "sewage": 102,
        "transport": {
          'road': 0.9,
          'rail': 0.1
        },

        "green_space": 1,
        "parking_demand": 0.5
      },
      "Low Rennovation": {
        "retail_m2_per_visitor": 8,
        "total_daily_visitors_retail": 1000,
        "retail_floors": 2,
        "percent_interested_in_luxury_retail": .1,
        "percent_interested_in_support_retail": .2,
        "percent_interested_in_fmcg_retail": .5,
        "percent_interested_in_food_retail": .2,
        "beds": 0.0045,
        "police_stations": 0.0045,
        "fire_stations": 0.0045,
        "schools": 0,
        "energy": 14,
        "water": 220,
        "sewage": 102,
        "transport": {
          'road': 0.9,
          'rail': 0.1
        },

        "green_space": 1,
        "parking_demand": 0.5
      }
    };


    var selected_subclass = $("#base_asset_subclass").val();
    selected_subclass = (selected_subclass) ? selected_subclass : 'New Build';


    $("#retail_m2_per_visitor").editable('setValue', retail_class_defaults[selected_subclass]['retail_m2_per_visitor']);
    $("#total_daily_visitors_retail").editable('setValue', retail_class_defaults[selected_subclass]['total_daily_visitors_retail']);
    $("#retail_floors").editable('setValue', retail_class_defaults[selected_subclass]['retail_floors']);
    $("#percent_interested_in_luxury_retail").editable('setValue', retail_class_defaults[selected_subclass]['percent_interested_in_luxury_retail']);
    $("#percent_interested_in_support_retail").editable(
      'setValue', retail_class_defaults[selected_subclass]['percent_interested_in_support_retail']);
    $("#percent_interested_in_fmcg_retail").editable('setValue', retail_class_defaults[selected_subclass]['percent_interested_in_fmcg_retail']);
    $("#percent_interested_in_food_retail").editable('setValue', retail_class_defaults[selected_subclass]['percent_interested_in_fmcg_retail']);



    const population = parseInt(retail_class_defaults[selected_subclass]['retail_m2_per_visitor']);
    myDisplayUpdater = new ServicesDisplayUpdater();
    myDisplayUpdater.updateBeds(population, retail_class_defaults[selected_subclass]['beds']);
    myDisplayUpdater.updatePoliceStations(population, retail_class_defaults[selected_subclass][
      'police_stations'
    ]);
    myDisplayUpdater.updateFireStations(population, retail_class_defaults[selected_subclass][
      'fire_stations'
    ]);
    myDisplayUpdater.updateSchools(population * 0.05, retail_class_defaults[selected_subclass][
      'schools'
    ]);
    myDisplayUpdater.updateEnergy(population, retail_class_defaults[selected_subclass]['energy']);
    myDisplayUpdater.updateWater(population, retail_class_defaults[selected_subclass]['water']);
    myDisplayUpdater.updateSewage(population, retail_class_defaults[selected_subclass]['sewage']);
    const total_parking_area = myDisplayUpdater.updateTransport(population, retail_class_defaults[selected_subclass][
      'transport'
    ]['road'], retail_class_defaults[selected_subclass]['transport']['rail'], 2, 2, 0.5);

    const total_green_space_area = myDisplayUpdater.updateGreenSpace(population, retail_class_defaults[selected_subclass]['green_space']);

  }


}

var OfficeCalaulator = function () {
  this.initialize = function () {

    $('#office_m2_per_visitor').editable({
      'mode': 'inline',
      validate: function (value) {
        if ($.trim(value) == '') {
          return 'This field is required';
        } else if ($.isNumeric(value) == '') {
          return "Input must be a integer"
        }
      }
    });
    $('#office_floors').editable({
      'mode': 'inline',
      validate: function (value) {
        if ($.trim(value) == '') {
          return 'This field is required';
        } else if ($.isNumeric(value) == '') {
          return "Input must be a integer"
        }
      }
    });
    $('#total_daily_visitors_office').editable({
      'mode': 'inline',
      validate: function (value) {
        if ($.trim(value) == '') {
          return 'This field is required';
        } else if ($.isNumeric(value) == '') {
          return "Input must be a integer"
        }
      }
    });
    $('#direct_employees_to_visitor_ratio_office').editable({
      'mode': 'inline',
      validate: function (value) {
        if ($.trim(value) == '') {
          return 'This field is required';
        } else if ($.isNumeric(value) == '') {
          return "Input must be a integer"
        }
      }
    });
    $('#indirect_to_direct_employees_ratio_office').editable({
      'mode': 'inline',
      validate: function (value) {
        if ($.trim(value) == '') {
          return 'This field is required';
        } else if ($.isNumeric(value) == '') {
          return "Input must be a integer"
        }
      }
    });

  }
  this.recompute = function () {
    const office_m2_per_visitor = $("#office_m2_per_visitor").editable('getValue', true);
    const total_daily_visitors_office = $("#total_daily_visitors_office").editable('getValue', true);
    const office_floors = $("#office_floors").editable('getValue', true);
    const direct_employees_to_visitor_ratio = $("#direct_employees_to_visitor_ratio_office").editable('getValue', true);
    const indirect_to_direct_employees_ratio_office = $("#indirect_to_direct_employees_ratio_office").editable('getValue', true);

    const diagram_area = diagramdetail['area']

    const total_floor_area_office = ((office_m2_per_visitor * total_daily_visitors_office));
    // const total_floor_area_office_per_floor = (total_floor_area_office / office_floors);
    const total_floor_area_available = parseInt(diagram_area * 0.8 * office_floors);

    $("#total_floor_area_office_required").html(abbrNum(parseInt(total_floor_area_office), 2));
    $("#total_floor_area_office_available").html(abbrNum(total_floor_area_available, 2));

    $("#total_direct_employment_office").html(parseInt(direct_employees_to_visitor_ratio * total_daily_visitors_office));
    $("#total_indirect_employment_office").html(parseInt(indirect_to_direct_employees_ratio_office * total_daily_visitors_office));

    myDisplayUpdater = new ServicesDisplayUpdater();

    myDisplayUpdater.updateBedsRecompute(total_daily_visitors_office);
    myDisplayUpdater.updatePoliceStationsRecompute(total_daily_visitors_office);
    myDisplayUpdater.updateFireStationsRecompte(total_daily_visitors_office);
    myDisplayUpdater.updateSchoolsRecompute(total_daily_visitors_office * 0.05);
    myDisplayUpdater.updateEnergyRecompute(total_daily_visitors_office);
    myDisplayUpdater.updateWaterRecompute(total_daily_visitors_office);
    myDisplayUpdater.updateSewageRecompute(total_daily_visitors_office);
    const total_parking_area = myDisplayUpdater.updateTransportRecompute(total_daily_visitors_office, 2, 2);
    const total_green_space_area = myDisplayUpdater.updateGreenSpaceRecompute(total_daily_visitors_office);

    // const lu_chart_data = {"area_available":total_floor_area_available, "built_up_area":total_floor_area_office, "green_space":total_green_space_area[0], "parking":total_parking_area[0]};
    // populate_lu_chart('office', lu_chart_data);

  }


  this.update = function () {

    const office_class_defaults = {
      "New Build": {
        "office_m2_per_visitor": 12,
        "total_daily_visitors_office": 2000,
        "office_floors": 2,
        "beds": 0.0045,
        "direct_employees_to_visitor_ratio": .1,
        "indirect_to_direct_employees_ratio": .05,
        "police_stations": 0.0045,
        "fire_stations": 0.0045,
        "schools": 0,
        "energy": 14,
        "water": 220,
        "sewage": 102,
        "transport": {
          'road': 0.9,
          'rail': 0.1
        },
        "green_space": 1,
        "parking_demand": 0.5
      },
      "Full Rennovation": {
        "office_m2_per_visitor": 12,
        "total_daily_visitors_office": 1800,
        "office_floors": 2,
        "beds": 0.0045,
        "direct_employees_to_visitor_ratio": .1,
        "indirect_to_direct_employees_ratio": .05,
        "police_stations": 0.0045,
        "fire_stations": 0.0045,
        "schools": 0,
        "energy": 14,
        "water": 220,
        "sewage": 102,
        "transport": {
          'road': 0.9,
          'rail': 0.1
        },
        "green_space": 1,
        "parking_demand": 0.5
      },
      "Medium Rennovation": {
        "office_m2_per_visitor": 11,
        "total_daily_visitors_office": 1600,
        "office_floors": 2,
        "beds": 0.0045,
        "direct_employees_to_visitor_ratio": .1,
        "indirect_to_direct_employees_ratio": .05,
        "police_stations": 0.0045,
        "fire_stations": 0.0045,
        "schools": 0,
        "energy": 14,
        "water": 220,
        "sewage": 102,
        "transport": {
          'road': 0.9,
          'rail': 0.1
        },
        "green_space": 1,
        "parking_demand": 0.5
      },
      "Low Rennovation": {
        "office_m2_per_visitor": 10,
        "total_daily_visitors_office": 1500,
        "office_floors": 2,
        "beds": 0.0045,
        "direct_employees_to_visitor_ratio": .1,
        "indirect_to_direct_employees_ratio": .05,
        "police_stations": 0.0045,
        "fire_stations": 0.0045,
        "schools": 0,
        "energy": 14,
        "water": 220,
        "sewage": 102,
        "transport": {
          'road': 0.9,
          'rail': 0.1
        },
        "green_space": 1,
        "parking_demand": 0.5
      }
    };


    var selected_subclass = $("#base_asset_subclass").val();
    selected_subclass = (selected_subclass) ? selected_subclass : 'New Build';
    var diagram_area = diagramdetail['area'];

    $("#office_m2_per_visitor").editable('setValue', office_class_defaults[selected_subclass]['office_m2_per_visitor']);
    $("#total_daily_visitors_office").editable('setValue', office_class_defaults[selected_subclass]['total_daily_visitors_office']);
    $("#office_floors").editable('setValue', office_class_defaults[selected_subclass]['office_floors']);
    const office_floors = office_class_defaults[selected_subclass]['office_floors'];
    $("#direct_employees_to_visitor_ratio_office").editable('setValue', office_class_defaults[selected_subclass]['direct_employees_to_visitor_ratio']);
    $("#indirect_to_direct_employees_ratio_office").editable('setValue', office_class_defaults[selected_subclass]['direct_employees_to_visitor_ratio']);
    const population = parseInt(office_class_defaults[selected_subclass]['total_daily_visitors_office']);


    const total_floor_area_office = ((office_class_defaults[selected_subclass]['office_m2_per_visitor'] * office_class_defaults[selected_subclass]['total_daily_visitors_office']));
    $("#total_floor_area_office_required").html(abbrNum(parseInt(total_floor_area_office), 2));
    $("#total_floor_area_office_available").html(abbrNum(parseInt(diagram_area * 0.8 * office_floors), 2));

    const direct_employees_to_visitor_ratio = $("#direct_employees_to_visitor_ratio_office").editable('getValue', true);
    const indirect_to_direct_employees_ratio_office = $("#indirect_to_direct_employees_ratio_office").editable('getValue', true);
    $("#total_direct_employment_office").html(parseInt(direct_employees_to_visitor_ratio * office_class_defaults[selected_subclass]['total_daily_visitors_office']), 2);
    $("#total_indirect_employment_office").html(parseInt(indirect_to_direct_employees_ratio_office * office_class_defaults[selected_subclass]['total_daily_visitors_office']), 2);



    myDisplayUpdater = new ServicesDisplayUpdater();
    myDisplayUpdater.updateBeds(population, office_class_defaults[selected_subclass]['beds']);
    myDisplayUpdater.updatePoliceStations(population, office_class_defaults[selected_subclass][
      'police_stations'
    ]);
    myDisplayUpdater.updateFireStations(population, office_class_defaults[selected_subclass][
      'fire_stations'
    ]);
    myDisplayUpdater.updateSchools(population * 0.05, office_class_defaults[selected_subclass][
      'schools'
    ]);
    myDisplayUpdater.updateEnergy(population, office_class_defaults[selected_subclass]['energy']);
    myDisplayUpdater.updateWater(population, office_class_defaults[selected_subclass]['water']);
    myDisplayUpdater.updateSewage(population, office_class_defaults[selected_subclass]['sewage']);
    const total_parking_area = myDisplayUpdater.updateTransport(population, office_class_defaults[selected_subclass][
      'transport'
    ]['road'], office_class_defaults[selected_subclass]['transport']['rail'], 2, 2, 0.5);
    const total_green_space_area = myDisplayUpdater.updateGreenSpace(population, office_class_defaults[selected_subclass]['green_space']);
    myDisplayUpdater.updateParking(population * 0.5, office_class_defaults[selected_subclass]['parking_demand'])

  }


}

var AmenityCalaulator = function () {
  this.initialize = function () {

    $('#amenity_m2_per_visitor').editable({
      'mode': 'inline',
      validate: function (value) {
        if ($.trim(value) == '') {
          return 'This field is required';
        } else if ($.isNumeric(value) == '') {
          return "Input must be a integer"
        }
      }
    });
    $('#amenity_floors').editable({
      'mode': 'inline',
      validate: function (value) {
        if ($.trim(value) == '') {
          return 'This field is required';
        } else if ($.isNumeric(value) == '') {
          return "Input must be a integer"
        }
      }
    });
    $('#total_daily_visitors_amenity').editable({
      'mode': 'inline',
      validate: function (value) {
        if ($.trim(value) == '') {
          return 'This field is required';
        } else if ($.isNumeric(value) == '') {
          return "Input must be a integer"
        }
      }
    });
    $('#direct_employees_to_visitor_ratio_amenity').editable({
      'mode': 'inline',
      validate: function (value) {
        if ($.trim(value) == '') {
          return 'This field is required';
        } else if ($.isNumeric(value) == '') {
          return "Input must be a integer"
        }
      }
    });
    $('#indirect_to_direct_employees_ratio_amenity').editable({
      'mode': 'inline',
      validate: function (value) {
        if ($.trim(value) == '') {
          return 'This field is required';
        } else if ($.isNumeric(value) == '') {
          return "Input must be a integer"
        }
      }
    });

  }
  this.recompute = function () {
    const amenity_m2_per_visitor = $("#amenity_m2_per_visitor").editable('getValue', true);
    const total_daily_visitors_amenity = $("#total_daily_visitors_amenity").editable('getValue', true);
    const amenity_floors = $("#amenity_floors").editable('getValue', true);
    const direct_employees_to_visitor_ratio = $("#direct_employees_to_visitor_ratio_amenity").editable('getValue', true);
    const indirect_to_direct_employees_ratio_amenity = $("#indirect_to_direct_employees_ratio_amenity").editable('getValue', true);

    const diagram_area = diagramdetail['area']

    const total_floor_area_amenity = ((amenity_m2_per_visitor * total_daily_visitors_amenity));
    // const total_floor_area_office_per_floor = (total_floor_area_office / office_floors);
    const total_floor_area_available = parseInt(diagram_area * 0.8 * amenity_floors);

    $("#total_floor_area_amenity_required").html(abbrNum(parseInt(total_floor_area_amenity), 2));
    $("#total_floor_area_amenity_available").html(abbrNum(total_floor_area_available, 2));

    $("#total_direct_employment_amenity").html(parseInt(direct_employees_to_visitor_ratio * total_daily_visitors_amenity));
    $("#total_indirect_employment_amenity").html(parseInt(indirect_to_direct_employees_ratio_amenity * total_daily_visitors_amenity));

    myDisplayUpdater = new ServicesDisplayUpdater();

    myDisplayUpdater.updateBedsRecompute(total_daily_visitors_amenity);
    myDisplayUpdater.updatePoliceStationsRecompute(total_daily_visitors_amenity);
    myDisplayUpdater.updateFireStationsRecompte(total_daily_visitors_amenity);
    myDisplayUpdater.updateSchoolsRecompute(total_daily_visitors_amenity * 0.05);
    myDisplayUpdater.updateEnergyRecompute(total_daily_visitors_amenity);
    myDisplayUpdater.updateWaterRecompute(total_daily_visitors_amenity);
    myDisplayUpdater.updateSewageRecompute(total_daily_visitors_amenity);
    const total_parking_area = myDisplayUpdater.updateTransportRecompute(total_daily_visitors_amenity, 2, 2);
    const total_green_space_area = myDisplayUpdater.updateGreenSpaceRecompute(total_daily_visitors_amenity);

    // const lu_chart_data = {"area_available":total_floor_area_available, "built_up_area":total_floor_area_office, "green_space":total_green_space_area[0], "parking":total_parking_area[0]};
    // populate_lu_chart('office', lu_chart_data);

  }


  this.update = function () {

    const amenity_class_defaults = {
      "New Build": {
        "amenity_m2_per_visitor": 12,
        "total_daily_visitors_amenity": 2000,
        "amenity_floors": 2,
        "beds": 0.0045,
        "direct_employees_to_visitor_ratio": .1,
        "indirect_to_direct_employees_ratio": .05,
        "police_stations": 0.0045,
        "fire_stations": 0.0045,
        "schools": 0,
        "energy": 14,
        "water": 220,
        "sewage": 102,
        "transport": {
          'road': 0.9,
          'rail': 0.1
        },
        "green_space": 1,
        "parking_demand": 0.5
      },
      "Full Rennovation": {
        "amenity_m2_per_visitor": 12,
        "total_daily_visitors_amenity": 1800,
        "amenity_floors": 2,
        "beds": 0.0045,
        "direct_employees_to_visitor_ratio": .1,
        "indirect_to_direct_employees_ratio": .05,
        "police_stations": 0.0045,
        "fire_stations": 0.0045,
        "schools": 0,
        "energy": 14,
        "water": 220,
        "sewage": 102,
        "transport": {
          'road': 0.9,
          'rail': 0.1
        },
        "green_space": 1,
        "parking_demand": 0.5
      },
      "Medium Rennovation": {
        "amenity_m2_per_visitor": 11,
        "total_daily_visitors_amenity": 1600,
        "amenity_floors": 2,
        "beds": 0.0045,
        "direct_employees_to_visitor_ratio": .1,
        "indirect_to_direct_employees_ratio": .05,
        "police_stations": 0.0045,
        "fire_stations": 0.0045,
        "schools": 0,
        "energy": 14,
        "water": 220,
        "sewage": 102,
        "transport": {
          'road': 0.9,
          'rail': 0.1
        },
        "green_space": 1,
        "parking_demand": 0.5
      },
      "Low Rennovation": {
        "amenity_m2_per_visitor": 10,
        "total_daily_visitors_amenity": 1500,
        "amenity_floors": 2,
        "beds": 0.0045,
        "direct_employees_to_visitor_ratio": .1,
        "indirect_to_direct_employees_ratio": .05,
        "police_stations": 0.0045,
        "fire_stations": 0.0045,
        "schools": 0,
        "energy": 14,
        "water": 220,
        "sewage": 102,
        "transport": {
          'road': 0.9,
          'rail': 0.1
        },
        "green_space": 1,
        "parking_demand": 0.5
      }
    };


    var selected_subclass = $("#base_asset_subclass").val();
    selected_subclass = (selected_subclass) ? selected_subclass : 'New Build';
    var diagram_area = diagramdetail['area'];

    $("#amenity_m2_per_visitor").editable('setValue', amenity_class_defaults[selected_subclass]['amenity_m2_per_visitor']);
    $("#total_daily_visitors_amenity").editable('setValue', amenity_class_defaults[selected_subclass]['total_daily_visitors_amenity']);
    $("#amenity_floors").editable('setValue', amenity_class_defaults[selected_subclass]['amenity_floors']);
    const amenity_floors = amenity_class_defaults[selected_subclass]['amenity_floors'];
    $("#direct_employees_to_visitor_ratio_amenity").editable('setValue', amenity_class_defaults[selected_subclass]['direct_employees_to_visitor_ratio']);
    $("#indirect_to_direct_employees_ratio_amenity").editable('setValue', amenity_class_defaults[selected_subclass]['direct_employees_to_visitor_ratio']);
    const population = parseInt(amenity_class_defaults[selected_subclass]['total_daily_visitors_amenity']);


    const total_floor_area_amenity = ((amenity_class_defaults[selected_subclass]['amenity_m2_per_visitor'] * amenity_class_defaults[selected_subclass]['total_daily_visitors_amenity']));
    $("#total_floor_area_amenity_required").html(abbrNum(parseInt(total_floor_area_amenity), 2));
    $("#total_floor_area_amenity_available").html(abbrNum(parseInt(diagram_area * 0.8 * amenity_floors), 2));

    const direct_employees_to_visitor_ratio = $("#direct_employees_to_visitor_ratio_amenity").editable('getValue', true);
    const indirect_to_direct_employees_ratio_amenity = $("#indirect_to_direct_employees_ratio_amenity").editable('getValue', true);
    $("#total_direct_employment_amenity").html(parseInt(direct_employees_to_visitor_ratio * amenity_class_defaults[selected_subclass]['total_daily_visitors_amenity']), 2);
    $("#total_indirect_employment_amenity").html(parseInt(indirect_to_direct_employees_ratio_amenity * amenity_class_defaults[selected_subclass]['total_daily_visitors_amenity']), 2);



    myDisplayUpdater = new ServicesDisplayUpdater();
    myDisplayUpdater.updateBeds(population, amenity_class_defaults[selected_subclass]['beds']);
    myDisplayUpdater.updatePoliceStations(population, amenity_class_defaults[selected_subclass][
      'police_stations'
    ]);
    myDisplayUpdater.updateFireStations(population, amenity_class_defaults[selected_subclass][
      'fire_stations'
    ]);
    myDisplayUpdater.updateSchools(population * 0.05, amenity_class_defaults[selected_subclass][
      'schools'
    ]);
    myDisplayUpdater.updateEnergy(population, amenity_class_defaults[selected_subclass]['energy']);
    myDisplayUpdater.updateWater(population, amenity_class_defaults[selected_subclass]['water']);
    myDisplayUpdater.updateSewage(population, amenity_class_defaults[selected_subclass]['sewage']);
    const total_parking_area = myDisplayUpdater.updateTransport(population, amenity_class_defaults[selected_subclass][
      'transport'
    ]['road'], amenity_class_defaults[selected_subclass]['transport']['rail'], 2, 2, 0.5);
    const total_green_space_area = myDisplayUpdater.updateGreenSpace(population, amenity_class_defaults[selected_subclass]['green_space']);
    myDisplayUpdater.updateParking(population * 0.5, amenity_class_defaults[selected_subclass]['parking_demand'])

  }


}

var MixedUseCalaulator = function () {
  this.generateResidentialUnits = function (diagramArea, sysName, sysTag) {

    var whiteListedSysName = ['HDH', 'LDH', 'IND', 'COM', 'COMIND', 'HSNG', 'HSG', 'MXD'];

    var COMBuilding = function () {
      const elevationoffset = 1;
      const comHeights = [14, 25, 30, 22, 28];
      const floorHeight = 5;
      const avgUnitsize = 50;

      this.generateUnits = function (area) {
        var height = elevationoffset + comHeights[Math.floor(Math.random() * comHeights
          .length)];
        var numFloors = Math.round(height / floorHeight); // 5 meter per floor
        var numUnitsperFloor = Math.round(area / avgUnitsize);
        var totalUnits = numUnitsperFloor * numFloors;
        return totalUnits;
      };
    }

    var LDHousing = function () {
      const elevationoffset = 1;
      const ldhHeights = [1, 2, 3];
      const floorHeight = 5;
      const avgUnitsize = 100;

      this.generateUnits = function (area) {
        var height = elevationoffset + ldhHeights[Math.floor(Math.random() * ldhHeights
          .length)];
        var numFloors = Math.round(height / floorHeight); // 5 meter per floor
        var numUnitsperFloor = Math.round(area / avgUnitsize);
        var totalUnits = numUnitsperFloor * numFloors;
        return totalUnits;
      };
    }

    var HDHousing = function () {
      const elevationoffset = 1;
      const hdhHeights = [36, 60, 90]; // in meters 
      const floorHeight = 5;
      const avgUnitsize = 50;

      this.generateUnits = function (area) {
        var height = elevationoffset + hdhHeights[Math.floor(Math.random() * hdhHeights
          .length)];
        var numFloors = Math.round(height / floorHeight); // 5 meter per floor
        var numUnitsperFloor = Math.round(area / avgUnitsize);
        var totalUnits = numUnitsperFloor * numFloors;
        return totalUnits;
      };
    }

    var MXDBuildings = function () {
      const elevationoffset = 1;
      const mxdHeights = [9, 12, 8, 11]; // in meters 
      const floorHeight = 5;
      const avgUnitsize = 75;

      this.generateUnits = function (area) {
        var height = elevationoffset + mxdHeights[Math.floor(Math.random() * mxdHeights
          .length)];
        var numFloors = Math.round(height / floorHeight); // 5 meter per floor
        var numUnitsperFloor = Math.round(area / avgUnitsize);
        var totalUnits = numUnitsperFloor * numFloors;
        return totalUnits;
      };
    }

    var LABBuildings = function () {
      const elevationoffset = 1;
      var labHeights = [10, 15];
      const floorHeight = 5;
      const avgUnitsize = 100;

      this.generateUnits = function (area) {
        var height = elevationoffset + labHeights[Math.floor(Math.random() * labHeights
          .length)];
        var numFloors = Math.round(height / floorHeight); // 5 meter per floor
        var numUnitsperFloor = Math.round(area / avgUnitsize);
        var totalUnits = numUnitsperFloor * numFloors;
        return totalUnits;
      };
    }

    var SMBBuildings = function () {
      const elevationoffset = 1;
      var smbHeights = [2, 3, 5, 6, 7, 10];
      const floorHeight = 5;
      const avgUnitsize = 75;

      this.generateUnits = function (area) {
        var height = elevationoffset + smbHeights[Math.floor(Math.random() * smbHeights
          .length)];
        var numFloors = Math.round(height / floorHeight); // 5 meter per floor
        var numUnitsperFloor = Math.round(area / avgUnitsize);
        var totalUnits = numUnitsperFloor * numFloors;
        return totalUnits;
      };
    }


    if (whiteListedSysName.indexOf(sysName) >= 0) { // system is whitelisted
      if ((sysName === 'HDH') || (sysName === 'HSNG') || (sysName === 'HSG')) {

        var hdh = new HDHousing();
        units = hdh.generateUnits(diagramArea);
      } else if (sysName === 'MXD') {


        var mxd = new MXDBuildings();
        var units = mxd.generateUnits(diagramArea);
      } else if (sysName === 'LDH') {
        var ldh = new LDHousing();
        units = ldh.generateUnits(diagramArea);

      } else if ((sysName === 'COM') || (sysName === 'COMIND') || (sysName === 'IND')) {
        var com = new COMBuilding();
        units = com.generateUnits(diagramArea);

      }
    } else if ((sysTag === 'Large buildings, Industry, commerce')) { // system not whitelisted
      var lab = new LABBuildings();
      units = lab.generateUnits(diagramArea);

    } else if ((sysTag === 'Small buildings, low density housing')) { // system not whitelisted 
      var smb = new SMBBuildings();
      units = smb.generateUnits(diagramArea);
      // yeild = 16;
    } else {
      units = 0;
      // yeild = 12; // default yeild
    }
    return units;
  }

  this.initcompute = function () {
    const numresidences = parseInt($("#residential_units_mixuse").editable('getValue', true));
    const population = parseInt($("#number_of_people_residential_mixuse").editable('getValue', true));
    const floors = parseInt($("#residential_floor_mixuses").editable('getValue', true));
    const far = parseInt($("#residential_far_mixuse").editable('getValue', true));
    // const population = $('#number_of_people_residential').editable('setValue', numresidences * 4);
    this.update(numresidences, population, floors, far);

  }
  this.initialize = function () {

    $('#residential_units_mixuse').editable({
      'mode': 'inline',
      validate: function (value) {
        if ($.trim(value) == '') {
          return 'This field is required';
        } else if ($.isNumeric(value) == '') {
          return "Input must be a integer"
        }
      }
    });


    $('#residential_floors_mixuse').editable({
      'mode': 'inline',
      validate: function (value) {
        if ($.trim(value) == '') {
          return 'This field is required';
        } else if ($.isNumeric(value) == '') {
          return "Input must be a integer"
        }
      }
    });


    $('#residential_far_mixuse').editable({
      'mode': 'inline',
      validate: function (value) {
        if ($.trim(value) == '') {
          return 'This field is required';
        } else if ($.isNumeric(value) == '') {
          return "Input must be a decimal"
        }
      }
    });

    $('#number_of_people_residential_mixuse').editable({
      'mode': 'inline',
      validate: function (value) {
        if ($.trim(value) == '') {
          return 'This field is required';
        } else if ($.isNumeric(value) == '') {
          return "Input must be a integer"
        }
      }
    });

    $('#retail_m2_per_visitor_mixuse').editable({
      'mode': 'inline',
      validate: function (value) {
        if ($.trim(value) == '') {
          return 'This field is required';
        } else if ($.isNumeric(value) == '') {
          return "Input must be a integer"
        }
      }
    });

    $('#retail_floors_mixuse').editable({
      'mode': 'inline',
      validate: function (value) {
        if ($.trim(value) == '') {
          return 'This field is required';
        } else if ($.isNumeric(value) == '') {
          return "Input must be a integer"
        }
      }
    });

    $('#total_daily_visitors_retail_mixuse').editable({
      'mode': 'inline',
      validate: function (value) {
        if ($.trim(value) == '') {
          return 'This field is required';
        } else if ($.isNumeric(value) == '') {
          return "Input must be a integer"
        }
      }
    });

    $('#percent_interested_in_luxury_retail_mixuse').editable({
      'mode': 'inline',
      validate: function (value) {
        if ($.trim(value) == '') {
          return 'This field is required';
        } else if ($.isNumeric(value) == '') {
          return "Input must be a integer"
        }
      }
    });

    $('#percent_interested_in_support_retail_mixuse').editable({
      'mode': 'inline',
      validate: function (value) {
        if ($.trim(value) == '') {
          return 'This field is required';
        } else if ($.isNumeric(value) == '') {
          return "Input must be a integer"
        }
      }
    });

    $('#percent_interested_in_fmcg_retail_mixuse').editable({
      'mode': 'inline',
      validate: function (value) {
        if ($.trim(value) == '') {
          return 'This field is required';
        } else if ($.isNumeric(value) == '') {
          return "Input must be a integer"
        }
      }
    });
    $('#percent_interested_in_food_retail_mixuse').editable({
      'mode': 'inline',
      validate: function (value) {
        if ($.trim(value) == '') {
          return 'This field is required';
        } else if ($.isNumeric(value) == '') {
          return "Input must be a integer"
        }
      }
    });
    $('#direct_employees_to_visitor_ratio_retail_mixuse').editable({
      'mode': 'inline',
      validate: function (value) {
        if ($.trim(value) == '') {
          return 'This field is required';
        } else if ($.isNumeric(value) == '') {
          return "Input must be a integer"
        }
      }
    });
    $('#indirect_to_direct_employees_ratio_retail_mixuse').editable({
      'mode': 'inline',
      validate: function (value) {
        if ($.trim(value) == '') {
          return 'This field is required';
        } else if ($.isNumeric(value) == '') {
          return "Input must be a integer"
        }
      }
    });

  }
  this.recompute = function () {
    myDisplayUpdater = new ServicesDisplayUpdater();
    const numresidences = parseInt($("#residential_units_mixuse").editable('getValue', true));
    const population = parseInt($("#number_of_people_residential_mixuse").editable('getValue', true));
    const floors = parseInt($("#residential_floors_mixuse").editable('getValue', true));

    const far = parseFloat($("#residential_far_mixuse").editable('getValue', true));


    var diagram_area = diagramdetail['area'];
    const area_in_km2 = (diagram_area / 1000000);
    const max_buildable_area_in_m2 = (diagram_area * floors);

    const new_population_density = population / area_in_km2;
    // console.log(diagram_area, far, floors)
    const total_floor_area_residential_available = parseInt((diagram_area * far * floors));
    const max_floor_area_available_per_floor = parseInt((diagram_area * far));
    const residences_per_floor = numresidences / floors;


    const total_floor_area_residential_available_per_floor = parseInt((total_floor_area_residential_available / floors));
    const avg_area_per_unit = (parseInt(total_floor_area_residential_available_per_floor) / parseInt(numresidences));

    const retail_m2_per_visitor = $("#retail_m2_per_visitor_mixuse").editable('getValue', true);
    const total_daily_visitors = $("#total_daily_visitors_retail_mixuse").editable('getValue', true);
    const number_of_floors = $("#retail_floors_mixuse").editable('getValue', true);
    const percent_interested_luxury = $("#percent_interested_in_luxury_retail_mixuse").editable('getValue', true);
    const percent_interested_support = $("#percent_interested_in_support_retail_mixuse").editable('getValue', true);
    const percent_interested_fmcg = $("#percent_interested_in_fmcg_retail_mixuse").editable('getValue', true);
    const percent_interested_food = $("#percent_interested_in_food_retail_mixuse").editable('getValue', true);

    const direct_employees_to_visitor_ratio_retail = $("#direct_employees_to_visitor_ratio_retail_mixuse").editable('getValue', true);
    const indirect_to_direct_employees_ratio_retail = $("#indirect_to_direct_employees_ratio_retail_mixuse").editable('getValue', true);
    const total_floor_area_luxury = (retail_m2_per_visitor * total_daily_visitors * percent_interested_luxury);
    const total_floor_area_support = (retail_m2_per_visitor * total_daily_visitors * percent_interested_support);
    const total_floor_area_fmcg = (retail_m2_per_visitor * total_daily_visitors * percent_interested_fmcg);
    const total_floor_area_other = (retail_m2_per_visitor * total_daily_visitors * percent_interested_food);

    const total_floor_area_retail = (total_floor_area_luxury + total_floor_area_support + total_floor_area_fmcg + total_floor_area_other);
    $("#total_floor_area_retail_luxury_split_mixuse").html(abbrNum(parseInt(total_floor_area_luxury), 2));
    $("#total_floor_area_retail_support_split_mixuse").html(abbrNum(parseInt(total_floor_area_support), 2));
    $("#total_floor_area_retail_fmcg_split_mixuse").html(abbrNum(parseInt(total_floor_area_fmcg), 2));
    $("#total_floor_area_retail_other_split_mixuse").html(abbrNum(parseInt(total_floor_area_other), 2));
    const total_floor_area_retail_available = diagram_area * 0.8 * number_of_floors;
    $("#total_floor_area_retail_required_mixuse").html(abbrNum(parseInt(total_floor_area_retail), 2));

    $("#total_floor_area_retail_available_mixuse").html(abbrNum(parseInt(total_floor_area_retail_available), 2)); // only 80% of the area is available, rest for frontage etc. 
    $("#total_direct_employment_retail_mixuse").html(parseInt(direct_employees_to_visitor_ratio_retail * total_daily_visitors));
    $("#total_indirect_employment_retail_mixuse").html(parseInt(indirect_to_direct_employees_ratio_retail * total_daily_visitors));

    $("#current_pop_density_mixuse").html(abbrNum(new_population_density, 2));
    $("#total_floor_area_residential_built_mixuse").html(abbrNum(total_floor_area_residential_available, 2));
    $("#total_floor_area_residential_available_mixuse").html(abbrNum(max_buildable_area_in_m2, 2));
    $("#avg_area_per_unit_mixuse").html(abbrNum(parseInt(avg_area_per_unit), 2) + ' m2 / ' + abbrNum(total_floor_area_residential_available_per_floor, 2) + ' m2 per floor');

    const total_people = population + total_daily_visitors;

    myDisplayUpdater.updateBedsRecompute(total_people);
    myDisplayUpdater.updatePoliceStationsRecompute(total_people);
    myDisplayUpdater.updateFireStationsRecompte(total_people);
    myDisplayUpdater.updateSchoolsRecompute(population * 0.05);
    myDisplayUpdater.updateEnergyRecompute(population);
    myDisplayUpdater.updateWaterRecompute(population);
    myDisplayUpdater.updateSewageRecompute(population);
    const total_parking_area = myDisplayUpdater.updateTransportRecompute(population, 2, 2);
    const total_green_space_area = myDisplayUpdater.updateGreenSpaceRecompute(population);
    const total_area_avialable = max_buildable_area_in_m2 + total_floor_area_retail_available;
    const total_built_up_area = total_floor_area_residential_available + total_floor_area_retail;
    // console.log(total_area_avialable,max_buildable_area_in_m2,  total_floor_area_retail_available);
    // console.log(total_built_up_area,total_floor_area_residential_available, total_floor_area_retail );
    // const lu_chart_data =  {"area_available":total_area_avialable, "built_up_area":total_built_up_area, "green_space":total_green_space_area[0], "parking":total_parking_area[0]};
    // populate_lu_chart('residential', lu_chart_data);

  }
  this.update = function (units, total_people, floors) {
    const mixuse_class_defaults = {
      "Luxury": {
        "retail_m2_per_visitor_mixuse": 12,
        "total_daily_visitors_retail_mixuse": 2000,
        "retail_floors_mixuse": 2,
        "percent_interested_in_luxury_retail_mixuse": .1,
        "percent_interested_in_support_retail_mixuse": .2,
        "percent_interested_in_fmcg_retail_mixuse": .5,
        "percent_interested_in_food_retail_mixuse": .2,
        "beds": 0.0025,
        "police_stations": 0.0025,
        "fire_stations": 0.0025,
        "schools": 4,
        "energy": 14,
        "water": 220,
        "sewage": 102,
        "transport": {
          'road': 0.9,
          'rail': 0.1
        },
        "far": 0.6,
        "green_space": 9,
        "parking_demand": 0.5
      },
      "High Priced": {
        "retail_m2_per_visitor_mixuse": 12,
        "total_daily_visitors_retail_mixuse": 2000,
        "retail_floors_mixuse": 2,
        "percent_interested_in_luxury_retail_mixuse": .1,
        "percent_interested_in_support_retail_mixuse": .2,
        "percent_interested_in_fmcg_retail_mixuse": .5,
        "percent_interested_in_food_retail_mixuse": .2,
        "beds": 0.0025,
        "police_stations": 0.0025,
        "fire_stations": 0.0025,
        "schools": 4,
        "energy": 14,
        "water": 220,
        "sewage": 102,
        "transport": {
          'road': 0.9,
          'rail': 0.1
        },
        "far": 0.6,
        "green_space": 9,
        "parking_demand": 0.5
      },
      "Mid Priced": {
        "retail_m2_per_visitor_mixuse": 12,
        "total_daily_visitors_retail_mixuse": 2000,
        "retail_floors_mixuse": 2,
        "percent_interested_in_luxury_retail_mixuse": .1,
        "percent_interested_in_support_retail_mixuse": .2,
        "percent_interested_in_fmcg_retail_mixuse": .5,
        "percent_interested_in_food_retail_mixuse": .2,
        "beds": 0.0035,
        "police_stations": 0.0035,
        "fire_stations": 0.0035,
        "schools": 5,
        "energy": 12.8,
        "water": 200,
        "sewage": 82,
        "transport": {
          'road': 0.3,
          'rail': 0.7
        },
        "far": 0.6,
        "green_space": 9,
        "parking_demand": 0.5
      },
      "Low Priced": {
        "retail_m2_per_visitor_mixuse": 12,
        "total_daily_visitors_retail_mixuse": 2000,
        "retail_floors_mixuse": 2,
        "percent_interested_in_luxury_retail_mixuse": .1,
        "percent_interested_in_support_retail_mixuse": .2,
        "percent_interested_in_fmcg_retail_mixuse": .5,
        "percent_interested_in_food_retail_mixuse": .2,
        "beds": 0.0045,
        "police_stations": 0.0045,
        "fire_stations": 0.0045,
        "schools": 7,
        "energy": 10,
        "water": 180,
        "sewage": 72,
        "transport": {
          'road': 0.4,
          'rail': 0.6
        },
        "far": 0.6,
        "green_space": 9,
        "parking_demand": 0.5
      },
      "Affordable": {
        "retail_m2_per_visitor_mixuse": 12,
        "total_daily_visitors_retail_mixuse": 2000,
        "retail_floors_mixuse": 2,
        "percent_interested_in_luxury_retail_mixuse": .1,
        "percent_interested_in_support_retail_mixuse": .2,
        "percent_interested_in_fmcg_retail_mixuse": .5,
        "percent_interested_in_food_retail_mixuse": .2,
        "beds": 0.0055,
        "police_stations": 0.0055,
        "fire_stations": 0.0055,
        "schools": 10,
        "energy": 8,
        "water": 160,
        "sewage": 60,
        "transport": {
          'road': 0.5,
          'rail': 0.5
        },
        "far": 0.6,
        "green_space": 9,
        "parking_demand": 0.5
      },
      "New Build": {
        "retail_m2_per_visitor_mixuse": 12,
        "total_daily_visitors_retail_mixuse": 2000,
        "retail_floors_mixuse": 2,
        "percent_interested_in_luxury_retail_mixuse": .1,
        "percent_interested_in_support_retail_mixuse": .2,
        "percent_interested_in_fmcg_retail_mixuse": .5,
        "percent_interested_in_food_retail_mixuse": .2,
        "beds": 0.0055,
        "police_stations": 0.0055,
        "fire_stations": 0.0055,
        "schools": 10,
        "energy": 8,
        "water": 40,
        "sewage": 60,
        "transport": {
          'road': 0.5,
          'rail': 0.5
        },
        "far": 0.6,
        "green_space": 9,
        "parking_demand": 0.5
      },
      "Full Rennovation": {
        "retail_m2_per_visitor_mixuse": 12,
        "total_daily_visitors_retail_mixuse": 2000,
        "retail_floors_mixuse": 2,
        "percent_interested_in_luxury_retail_mixuse": .1,
        "percent_interested_in_support_retail_mixuse": .2,
        "percent_interested_in_fmcg_retail_mixuse": .5,
        "percent_interested_in_food_retail_mixuse": .2,
        "beds": 0.0055,
        "police_stations": 0.0055,
        "fire_stations": 0.0055,
        "schools": 10,
        "energy": 8,
        "water": 160,
        "sewage": 60,
        "transport": {
          'road': 0.5,
          'rail': 0.5
        },
        "far": 0.6,
        "green_space": 9,
        "parking_demand": 0.5
      },
      "Medium Rennovation": {
        "retail_m2_per_visitor_mixuse": 12,
        "total_daily_visitors_retail_mixuse": 2000,
        "retail_floors_mixuse": 2,
        "percent_interested_in_luxury_retail_mixuse": .1,
        "percent_interested_in_support_retail_mixuse": .2,
        "percent_interested_in_fmcg_retail_mixuse": .5,
        "percent_interested_in_food_retail_mixuse": .2,
        "beds": 0.0055,
        "police_stations": 0.0055,
        "fire_stations": 0.0055,
        "schools": 10,
        "energy": 8,
        "water": 60,
        "sewage": 60,
        "transport": {
          'road': 0.5,
          'rail': 0.5
        },
        "far": 0.6,
        "green_space": 9,
        "parking_demand": 0.5
      },
      "Low Rennovation": {
        "retail_m2_per_visitor_mixuse": 12,
        "total_daily_visitors_retail_mixuse": 2000,
        "retail_floors_mixuse": 2,
        "percent_interested_in_luxury_retail_mixuse": .1,
        "percent_interested_in_support_retail_mixuse": .2,
        "percent_interested_in_fmcg_retail_mixuse": .5,
        "percent_interested_in_food_retail_mixuse": .2,
        "beds": 0.0055,
        "police_stations": 0.0055,
        "fire_stations": 0.0055,
        "schools": 10,
        "energy": 8,
        "water": 160,
        "sewage": 60,
        "transport": {
          'road': 0.5,
          'rail': 0.5
        },
        "far": 0.6,
        "green_space": 9,
        "parking_demand": 0.5
      }
    };


    myDisplayUpdater = new ServicesDisplayUpdater();

    var system_id = diagramdetail['sysid'];
    var diagram_area = diagramdetail['area'];
    var system_tag = systemdetail['systag'];
    var system_name = systemdetail['sysname'];

    // if (units === 0 && population === 0) {

    units = myResidentialControl.generateResidentialUnits(diagram_area, system_name, system_tag);
    population = units * 4;
    floors = 1;
    // }


    var selected_subclass = $("#base_asset_subclass").val();

    selected_subclass = (selected_subclass) ? selected_subclass : 'Mid Priced';
    const total_floor_area_residential_mixuse_available = abbrNum(parseInt((diagram_area * mixuse_class_defaults[selected_subclass]['far'] * floors)),
      2)

    $("#total_floor_area_residential_available_mixuse").html(total_floor_area_residential_mixuse_available);
    $("#residential_units_mixuse").editable('setValue', units);
    $("#number_of_people_residential_mixuse").editable('setValue', total_people);


    $("#retail_m2_per_visitor_mixuse").editable('setValue', mixuse_class_defaults[selected_subclass]['retail_m2_per_visitor_mixuse']);
    $("#total_daily_visitors_retail_mixuse").editable('setValue', mixuse_class_defaults[selected_subclass]['total_daily_visitors_retail_mixuse']);
    $("#retail_floors").editable('setValue', mixuse_class_defaults[selected_subclass]['retail_floors']);
    $("#percent_interested_in_luxury_retail_mixuse").editable('setValue', mixuse_class_defaults[selected_subclass]['percent_interested_in_luxury_retail_mixuse']);
    $("#percent_interested_in_support_retail_mixuse").editable(
      'setValue', mixuse_class_defaults[selected_subclass]['percent_interested_in_support_retail_mixuse']);
    $("#percent_interested_in_fmcg_retail_mixuse").editable('setValue', mixuse_class_defaults[selected_subclass]['percent_interested_in_fmcg_retail_mixuse']);
    $("#percent_interested_in_food_retail_mixuse").editable('setValue', mixuse_class_defaults[selected_subclass]['percent_interested_in_fmcg_retail_mixuse']);




    const area_in_km2 = (diagram_area / 1000000);
    const new_population_density = total_people / area_in_km2;

    $("#current_pop_density_mixuse").html(abbrNum(new_population_density, 2));

    myDisplayUpdater.updateBeds(total_people, mixuse_class_defaults[selected_subclass]['beds']);
    myDisplayUpdater.updatePoliceStations(total_people, mixuse_class_defaults[selected_subclass]['police_stations']);
    myDisplayUpdater.updateFireStations(total_people, mixuse_class_defaults[selected_subclass]['fire_stations']);
    myDisplayUpdater.updateSchools(total_people * 0.05, mixuse_class_defaults[selected_subclass]['schools']);
    myDisplayUpdater.updateEnergy(total_people, mixuse_class_defaults[selected_subclass]['energy']);
    myDisplayUpdater.updateWater(total_people, mixuse_class_defaults[selected_subclass]['water']);
    myDisplayUpdater.updateSewage(total_people, mixuse_class_defaults[selected_subclass]['sewage']);
    myDisplayUpdater.updateTransport(total_people, mixuse_class_defaults[selected_subclass]['transport']['road'], mixuse_class_defaults[selected_subclass]['transport']['rail'], 2, 2, 0.5);

    myDisplayUpdater.updateGreenSpace(total_people, mixuse_class_defaults[selected_subclass]['green_space']);

    myDisplayUpdater.updateParking(total_people * .5, mixuse_class_defaults[selected_subclass]['parking_demand']);

  }
}


var TransportCalculator = function () {
  this.initialize = function () {

    $('#transport_passenger_trips').editable({
      'mode': 'inline',
      validate: function (value) {
        if ($.trim(value) == '') {
          return 'This field is required';
        } else if ($.isNumeric(value) == '') {
          return "Input must be a integer"
        }
      }
    });

  }
  this.recompute = function () {
    const transport_passenger_trips = $("#transport_passenger_trips").editable('getValue', true);


    const population = parseInt(transport_passenger_trips) * 2;


    myDisplayUpdater = new ServicesDisplayUpdater();

    myDisplayUpdater.updateBedsRecompute(0);
    myDisplayUpdater.updatePoliceStationsRecompute(0);
    myDisplayUpdater.updateFireStationsRecompte(0);
    myDisplayUpdater.updateSchoolsRecompute(0 * 0.05);
    myDisplayUpdater.updateEnergyRecompute(0);
    myDisplayUpdater.updateWaterRecompute(0);
    myDisplayUpdater.updateSewageRecompute(0);
    const total_parking_area = myDisplayUpdater.updateTransportRecompute(population, 2, 2);
    const total_green_space_area = myDisplayUpdater.updateGreenSpaceRecompute(population);

    // const lu_chart_data = {"area_available":0, "built_up_area":0, "green_space":0, "parking":0};
    // populate_lu_chart('transport', lu_chart_data);

  }


  this.update = function () {

    const transport_class_defaults = {
      "New Build": {
        "transport_passenger_trips": 12,
        "beds": 0.0055,
        "police_stations": 0.0045,
        "fire_stations": 0.0045,
        "schools": 0,
        "energy": 14,
        "water": 220,
        "sewage": 102,
        "transport": {
          'road': 0.9,
          'rail': 0.1
        },
        "green_space": 1,
        "parking_demand": 0.5
      },
      "Full Rennovation": {
        "transport_passenger_trips": 12,
        "beds": 0.0055,
        "police_stations": 0.0045,
        "fire_stations": 0.0045,
        "schools": 0,
        "energy": 14,
        "water": 40,
        "sewage": 102,
        "transport": {
          'road': 0.9,
          'rail': 0.1
        },
        "green_space": 1,
        "parking_demand": 0.5
      },
      "Medium Rennovation": {
        "transport_passenger_trips": 12,
        "beds": 0.0055,
        "police_stations": 0.0045,
        "fire_stations": 0.0045,
        "schools": 0,
        "energy": 14,
        "water": 40,
        "sewage": 102,
        "transport": {
          'road': 0.9,
          'rail': 0.1
        },
        "green_space": 1,
        "parking_demand": 0.5
      },
      "Low Rennovation": {
        "transport_passenger_trips": 12,
        "beds": 0.0055,
        "police_stations": 0.0045,
        "fire_stations": 0.0045,
        "schools": 0,
        "energy": 14,
        "water": 35,
        "sewage": 102,
        "transport": {
          'road': 0.9,
          'rail': 0.1
        },
        "green_space": 1,
        "parking_demand": 0.5
      }
    };


    var selected_subclass = $("#base_asset_subclass").val();
    selected_subclass = (selected_subclass) ? selected_subclass : 'New Build';
    var diagram_area = diagramdetail['area'];

    $("#transport_passenger_trips").editable('setValue', transport_class_defaults[selected_subclass]['transport_passenger_trips']);
    const population = parseInt(transport_class_defaults[selected_subclass]['transport_passenger_trips']) * 2;


    myDisplayUpdater = new ServicesDisplayUpdater();
    myDisplayUpdater.updateBeds(0, transport_class_defaults[selected_subclass]['beds']);
    myDisplayUpdater.updatePoliceStations(0, transport_class_defaults[selected_subclass][
      'police_stations'
    ]);
    myDisplayUpdater.updateFireStations(0, transport_class_defaults[selected_subclass][
      'fire_stations'
    ]);
    myDisplayUpdater.updateSchools(0 * 0.05, transport_class_defaults[selected_subclass][
      'schools'
    ]);
    myDisplayUpdater.updateEnergy(0, transport_class_defaults[selected_subclass]['energy']);
    myDisplayUpdater.updateWater(0, transport_class_defaults[selected_subclass]['water']);
    myDisplayUpdater.updateSewage(0, transport_class_defaults[selected_subclass]['sewage']);
    const total_parking_area = myDisplayUpdater.updateTransport(population, transport_class_defaults[selected_subclass][
      'transport'
    ]['road'], transport_class_defaults[selected_subclass]['transport']['rail'], 2, 2, 0.5);
    const total_green_space_area = myDisplayUpdater.updateGreenSpace(population, transport_class_defaults[selected_subclass]['green_space']);
    myDisplayUpdater.updateParking(population * 0.5, transport_class_defaults[selected_subclass]['parking_demand'])

  }


}


var CommunityCalculator = function () {
  this.initialize = function () {
    $('#community_visitors').editable({
      'mode': 'inline',
      validate: function (value) {
        if ($.trim(value) == '') {
          return 'This field is required';
        } else if ($.isNumeric(value) == '') {
          return "Input must be a integer"
        }
      }
    });

    $('#community_residents').editable({
      'mode': 'inline',
      validate: function (value) {
        if ($.trim(value) == '') {
          return 'This field is required';
        } else if ($.isNumeric(value) == '') {
          return "Input must be a integer"
        }
      }
    });

  }

  this.recompute = function () {
    const community_residents = $("#community_residents").editable('getValue', true);
    const community_visitors = $("#community_visitors").editable('getValue', true);

    const population = parseInt(community_visitors) + parseInt(community_residents);

    var diagram_area = diagramdetail['area'];
    const area_in_km2 = (diagram_area / 1000000);
    myDisplayUpdater = new ServicesDisplayUpdater();

    myDisplayUpdater.updateBedsRecompute(0);
    myDisplayUpdater.updatePoliceStationsRecompute(0);
    myDisplayUpdater.updateFireStationsRecompte(0);
    myDisplayUpdater.updateSchoolsRecompute(0 * 0.05);
    myDisplayUpdater.updateEnergyRecompute(0);
    myDisplayUpdater.updateWaterRecompute(0);
    myDisplayUpdater.updateSewageRecompute(0);
    const total_parking_area = myDisplayUpdater.updateTransportRecompute(0, 2, 2);
    const total_green_space_area = myDisplayUpdater.updateGreenSpaceRecompute(0);

    // const lu_chart_data = {"area_available":diagram_area, "built_up_area":0, "green_space":total_green_space_area[0], "parking":total_parking_area[0]};
    // populate_lu_chart('community', lu_chart_data);

  }


  this.update = function () {

    const community_class_defaults = {
      "Community Center": {
        "community_residents": 20,
        "community_visitors": 20,
        "beds": 0.0055,
        "police_stations": 0.0045,
        "fire_stations": 0.0045,
        "schools": 0,
        "energy": 14,
        "water": 10,
        "sewage": 10,
        "transport": {
          'road': 0.9,
          'rail': 0.1
        },
        "green_space": 1,
        "parking_demand": 0.5
      },
      "Playground": {
        "community_residents": 20,
        "community_visitors": 20,
        "beds": 0.0055,
        "police_stations": 0.0045,
        "fire_stations": 0.0045,
        "schools": 0,
        "energy": 14,
        "water": 10,
        "sewage": 10,
        "transport": {
          'road': 0.9,
          'rail': 0.1
        },
        "green_space": 1,
        "parking_demand": 0.5
      },
      "Amenity": {
        "community_residents": 20,
        "community_visitors": 20,
        "beds": 0.0055,
        "police_stations": 0.0045,
        "fire_stations": 0.0045,
        "schools": 0,
        "energy": 14,
        "water": 10,
        "sewage": 10,
        "transport": {
          'road': 0.9,
          'rail': 0.1
        },
        "green_space": 1,
        "parking_demand": 0.5
      },
      "Full Rennovation": {
        "community_residents": 20,
        "community_visitors": 20,
        "beds": 0.0055,
        "police_stations": 0.0045,
        "fire_stations": 0.0045,
        "schools": 0,
        "energy": 14,
        "water": 10,
        "sewage": 10,
        "transport": {
          'road': 0.9,
          'rail': 0.1
        },
        "green_space": 1,
        "parking_demand": 0.5
      },
      "New Build": {
        "community_residents": 20,
        "community_visitors": 20,
        "beds": 0.0055,
        "police_stations": 0.0045,
        "fire_stations": 0.0045,
        "schools": 0,
        "energy": 14,
        "water": 10,
        "sewage": 10,
        "transport": {
          'road': 0.9,
          'rail': 0.1
        },
        "green_space": 1,
        "parking_demand": 0.5
      },
      "Medium Rennovation": {
        "community_residents": 20,
        "community_visitors": 20,
        "beds": 0.0055,
        "police_stations": 0.0045,
        "fire_stations": 0.0045,
        "schools": 0,
        "energy": 14,
        "water": 10,
        "sewage": 10,
        "transport": {
          'road': 0.9,
          'rail': 0.1
        },
        "green_space": 1,
        "parking_demand": 0.5
      },
      "Low Rennovation": {
        "community_residents": 20,
        "community_visitors": 20,
        "beds": 0.0055,
        "police_stations": 0.0045,
        "fire_stations": 0.0045,
        "schools": 0,
        "energy": 14,
        "water": 10,
        "sewage": 10,
        "transport": {
          'road': 0.9,
          'rail': 0.1
        },
        "green_space": 1,
        "parking_demand": 0.5
      }
    };


    var selected_subclass = $("#base_asset_subclass").val();
    selected_subclass = (selected_subclass) ? selected_subclass : 'New Build';
    var diagram_area = diagramdetail['area'];

    $("#community_residents").editable('setValue', community_class_defaults[selected_subclass]['community_residents']);
    $("#community_visitors").editable('setValue', community_class_defaults[selected_subclass]['community_visitors']);
    const population = parseInt(community_class_defaults[selected_subclass]['community_visitors']);

    myDisplayUpdater = new ServicesDisplayUpdater();
    myDisplayUpdater.updateBeds(0, community_class_defaults[selected_subclass]['beds']);
    myDisplayUpdater.updatePoliceStations(0, community_class_defaults[selected_subclass]['police_stations']);
    myDisplayUpdater.updateFireStations(population, community_class_defaults[selected_subclass]['fire_stations']);
    myDisplayUpdater.updateSchools(population * 0.05, community_class_defaults[selected_subclass]['schools']);
    myDisplayUpdater.updateEnergy(population, community_class_defaults[selected_subclass]['energy']);
    myDisplayUpdater.updateWater(population, community_class_defaults[selected_subclass]['water']);
    myDisplayUpdater.updateSewage(population, community_class_defaults[selected_subclass]['sewage']);
    const total_parking_area = myDisplayUpdater.updateTransport(population, community_class_defaults[selected_subclass]['transport']['road'], community_class_defaults[selected_subclass]['transport']['rail'], 2, 2, 0.5);
    const total_green_space_area = myDisplayUpdater.updateGreenSpace(population, community_class_defaults[selected_subclass]['green_space']);
    myDisplayUpdater.updateParking(population * 0.5, community_class_defaults[selected_subclass]['parking_demand'])

  }
}

var ServicesDisplayUpdater = function () {

  this.updateBeds = function (population, demand) {
    $("#beds_per_capita").editable({'mode':'inline'}).editable( 'setValue', demand);
    
    const beds = parseInt((population * demand));
    $("#total_hospital_beds").html(abbrNum(beds, 2));
    $("#total_hospital_beds_raw").val(beds);
  }

  this.updateBedsRecompute = function (population) {
    const demand = $("#beds_per_capita").editable({'mode':'inline'}).editable('getValue', true);
    const beds = parseInt((population * demand));
    
    $("#total_hospital_beds").html(abbrNum(beds, 2));
    $("#total_hospital_beds_raw").val(beds);
  }


  this.updatePoliceStations = function (population, demand) {
    $("#police_station_per_capita").editable({'mode':'inline'}).editable('setValue', demand);
    // $("#police_station_per_capita").html(demand);
    const ps = parseInt(population * demand);
    $("#total_police_stations").html(abbrNum(ps, 2));
    // $("#police_station_per_capita").html(demand);
    $("#total_police_stations_raw").val(ps);

  }

  this.updatePoliceStationsRecompute = function (population) {
    const demand = $("#police_station_per_capita").editable({'mode':'inline'}).editable('getValue', true);
    // $("#police_station_per_capita").html(demand);
    const ps = parseInt(population * demand);
    $("#total_police_stations").html(abbrNum(ps, 2));
    $("#total_police_stations_raw").val(ps);

  }

  this.updateFireStations = function (population, demand) {
    $("#fire_station_per_capita").editable({'mode':'inline'}).editable('setValue', demand);
    const fs = parseInt((population * demand));
    // $("#fire_station_per_capita").html(demand);
    $("#total_firestations").html(abbrNum(fs, 2));
    $("#total_firestations_raw").val(fs);

  }

  this.updateFireStationsRecompte = function (population) {
    const demand = $("#fire_station_per_capita").editable({'mode':'inline'}).editable('getValue', true);
    // $("#fire_station_per_capita").html(demand);
    const fs = parseInt((population * demand));
    $("#total_firestations").html(abbrNum(fs, 2));
    $("#total_firestations_raw").val(fs);

  }

  this.updateSchools = function (population, demand) {
    $("#school_per_capita").editable({'mode':'inline'}).editable('setValue', demand);
    // $("#school_per_capita").html(demand);
    const sch = parseInt((population * demand));
    $("#total_schools").html(abbrNum(sch), 2);
    $("#total_schools_raw").val(sch);

    // $('.schools_editable').on('update', function (e, editable) {
    //     const population = $("#number_of_people_residential").val() * .05;
    //     console.log(population, editable.value)
    //     $("#total_schools").html(parseInt((population * editable.value)));
    // });
  }

  this.updateSchoolsRecompute = function (population, ) {
    const demand = $("#school_per_capita").editable({'mode':'inline'}).editable('getValue', true);
    const sch = parseInt((population * demand));
    $("#total_schools").html(abbrNum(sch), 2);
    $("#total_schools_raw").val(sch);

  }

  this.updateEnergy = function (population, demand) {
    $("#energy_per_capita").editable({'mode':'inline'}).editable('setValue', demand);

    const ed = parseInt((population * demand));
    $("#total_energy_demand").html(abbrNum(ed, 2));
    $("#total_energy_demand_raw").val(ed);

  }

  this.updateEnergyRecompute = function (population) {
    const demand = $("#energy_per_capita").editable({'mode':'inline'}).editable('getValue', true);

    const ed = parseInt((population * demand));
    $("#total_energy_demand").html(abbrNum(ed, 2));
    $("#total_energy_demand_raw").val(ed);

  }
  this.updateWater = function (population, demand) {
    $("#water_per_capita").editable({'mode':'inline'}).editable('setValue', demand);
    const water = parseInt(population * demand);

    $("#total_water_demand").html(abbrNum(water, 2));
    $("#total_water_demand_raw").val(water);

  }
  this.updateWaterRecompute = function (population) {
    const demand = $("#water_per_capita").editable({'mode':'inline'}).editable('getValue', true);
    const water = parseInt(population * demand);

    $("#total_water_demand").html(abbrNum(water, 2));
    $("#total_water_demand_raw").val(water);
  }

  this.updateSewage = function (population, demand) {
    $("#sewage_per_capita").editable({'mode':'inline'}).editable('setValue', demand);
    const sewage = parseInt(population * demand);
    $("#total_sewage_demand").html(abbrNum(sewage, 2));
    $("#total_sewage_demand_raw").val(sewage);
  }

  this.updateSewageRecompute = function (population) {
    const demand = $("#sewage_per_capita").editable({'mode':'inline'}).editable('getValue', true);
    const sewage = parseInt(population * demand);
    $("#total_sewage_demand").html(abbrNum(sewage, 2));
    $("#total_sewage_demand_raw").val(sewage);
  }

  this.updateLandUsageRecompute = function (area) {
    const land_area = $("#tourism_land_area").editable('getValue', true);
    // const floors = $("#tourism_floors").editable('getValue', true);
    // const m2_per_guest = $("#tourism_m2_per_guest").editable('getValue', true);
    // const people_per_room = $("#tourism_people_per_room").editable('getValue', true);

    const land_usage = parseInt(area / (land_area));

    return land_usage;
  }

  this.updateParking = function (cars, demand_factor) {
    $("#parking_factor").editable({'mode':'inline'}).editable('setValue', demand_factor);
    const total_parking = parseInt(cars * demand_factor);
    $("#total_parking").html(abbrNum(total_parking, 2));
    $("#total_parking_raw").val(total_parking);
  }

  this.updateParkingRecompute = function (cars) {
    const demand_factor = $("#parking_factor").editable({'mode':'inline'}).editable('getValue', true);
    const total_parking = parseInt(cars * demand_factor);
    $("#total_parking").html(abbrNum(total_parking, 2));
    $("#total_parking_raw").val(total_parking);
  }

  this.updateGreenSpace = function (population, gs_demand) {
    $("#per_capita_green_space").editable({'mode':'inline'}).editable('setValue', gs_demand);
    const gs = parseInt(population * gs_demand);
    $("#total_green_space").html(abbrNum(gs, 2));
    $("#total_green_space_raw").val(gs);
    return [gs];
  }

  this.updateGreenSpaceRecompute = function (population) {
    const gs_demand = $("#per_capita_green_space").editable({'mode':'inline'}).editable('getValue', true);
    const gs = parseInt(population * gs_demand);
    $("#total_green_space").html(abbrNum(gs, 2));
    $("#total_green_space_raw").val(gs);
    return [gs];
  }


  this.updateTransport = function (population, percent_road, percent_rail, times_road, times_rail, parking_demand_factor) {
    $("#percent_road_usage").editable({'mode':'inline'}).editable('setValue', percent_road);
    $("#percent_rail_usage").editable({'mode':'inline'}).editable('setValue', percent_rail);
    $("#parking_factor").editable({'mode':'inline'}).editable('setValue', parking_demand_factor);

    $("#road_terminal_freq").html(times_road);
    $("#rail_terminal_freq").html(times_rail);
    const t_rail = parseInt(population * percent_rail * times_rail);
    const t_road = parseInt(population * percent_road * times_road);
    const total_parking = parseInt((t_road / 2) * parking_demand_factor);
    $("#total_rail_usage").html(abbrNum(t_rail, 2));
    $("#total_rail_usage_raw").val(t_rail);
    $("#total_road_usage").html(abbrNum(t_road, 2));
    $("#total_road_usage_raw").val(t_road);
    $("#total_parking").html(abbrNum(total_parking, 2));
    $("#total_parking_raw").val(total_parking);
    const parking_space = parseInt(total_parking * 12.5);
    return [parking_space];

  }

  this.updateTransportRecompute = function (population, times_road, times_rail) {
    const percent_road = $("#percent_road_usage").editable({'mode':'inline'}).editable('getValue', true);
    const percent_rail = $("#percent_rail_usage").editable({'mode':'inline'}).editable('getValue', true);

    const t_rail = parseInt(population * percent_rail * times_rail);
    const t_road = parseInt(population * percent_road * times_road);

    const demand_factor = $("#parking_factor").editable('getValue', true);
    const total_parking = parseInt((t_road / 2) * demand_factor);
    $("#total_rail_usage").html(abbrNum(t_rail, 2));
    $("#total_rail_usage_raw").val(t_rail);
    $("#total_road_usage").html(abbrNum(t_road, 2));
    $("#total_road_usage_raw").val(t_road);

    $("#total_parking").html(abbrNum(total_parking, 2));
    $("#total_parking_raw").val(total_parking);

    const parking_space = parseInt(total_parking * 12.5);
    return [parking_space];
  }
};
myResidentialControl = new ResidentialCalaulator();
myTourismControl = new TourismCalaulator();
myRetailControl = new RetailCalaulator();
myOfficeControl = new OfficeCalaulator();
myAmenityControl = new AmenityCalaulator();
myMixedUseControl = new MixedUseCalaulator();
myTransportControl = new TransportCalculator();
myCommunityControl = new CommunityCalculator();
$(".services_form").addClass('d-none');


function render_saved_asset_data(asset_details){ 
  var asset_class = asset_details['asset_class'];
  var class_default_values = asset_details['class_default_values'];

  $("#base_asset_class option[data-value='" + asset_class + "']").attr("selected", "selected");

  updateClassControls(asset_class);
  if (asset_class == 'residential') {
    $("#base_asset_subclass").val(class_default_values['metadata']['base_asset_subclass']);
    $("#number_of_people_residential").editable('setValue', class_default_values['metadata']['number_of_people_residential']);
    $("#residential_units").editable('setValue', class_default_values['metadata']['residential_units']);
    $("#residential_floors").editable('setValue', class_default_values['metadata']['residential_floors']);
    if (class_default_values['metadata'].hasOwnProperty('residential_far')) {
      $("#residential_far").editable('setValue', class_default_values['metadata']['residential_far']);
    } else {
      $("#residential_far").editable('setValue', 0.6);
    }
    $("#current_pop_density").html(class_default_values['metadata']['current_pop_density']);
    $("#recompute_residential").click();
  } else if (asset_class == 'hospitality') {

    $("#base_asset_subclass").val(class_default_values['metadata']['base_asset_subclass']);
    $("#tourism_m2_per_guest").editable('setValue', class_default_values['metadata'][
      'tourism_m2_per_guest'
    ]);
    $("#tourism_floors").editable('setValue', class_default_values['metadata']['tourism_floors']);
    $("#tourism_land_area").editable('setValue', class_default_values['metadata']['tourism_land_area']);
    $("#tourism_people_per_room").editable('setValue', class_default_values['metadata']['tourism_people_per_room']);
    $("#target_occupancy_rate").editable('setValue', class_default_values['metadata']['target_occupancy_rate']);
    $("#tourism_total_rooms").html(class_default_values['metadata']['tourism_total_rooms']);
    $("#total_yearly_visitors").html(class_default_values['metadata']['total_yearly_visitors']);
    $("#recompute_tourism").click();

  } else if (asset_class == 'retail') {
    $("#base_asset_subclass").val(class_default_values['metadata']['base_asset_subclass']);
    $("#retail_m2_per_visitor").editable('setValue', class_default_values['metadata']['retail_m2_per_visitor']);
    $("#retail_floors").editable('setValue', class_default_values['metadata']['retail_floors']);
    $("#total_daily_visitors_retail").editable('setValue', class_default_values['metadata']['total_daily_visitors_retail']);

    $("#percent_interested_in_luxury_retail").editable('setValue', class_default_values['metadata']['percent_interested_in_luxury_retail']);
    $("#total_daily_visitors_retail").editable('setValue', class_default_values['metadata']['total_daily_visitors_retail']);
    $("#percent_interested_in_support_retail").editable('setValue', class_default_values['metadata']['percent_interested_in_support_retail']);
    $("#total_daily_visitors_retail").editable('setValue', class_default_values['metadata']['total_daily_visitors_retail'
    ]);
    $("#percent_interested_in_fmcg_retail").editable('setValue', class_default_values['metadata']['percent_interested_in_fmcg_retail']);
    $("#percent_interested_in_food_retail").editable('setValue', class_default_values['metadata']['percent_interested_in_food_retail']);
    $("#total_floor_area_retail_required").html(class_default_values['metadata']['total_floor_area_retail_required']);
    $("#recompute_retail").click();
  } else if (asset_class == 'office') {
    $("#base_asset_subclass").val(class_default_values['metadata']['base_asset_subclass']);
    $("#office_m2_per_visitor").editable('setValue', class_default_values['metadata']['office_m2_per_visitor']);
    $("#office_floors").editable('setValue', class_default_values['metadata']['office_floors']);
    $("#total_daily_visitors_office").editable('setValue', class_default_values['metadata']['total_daily_visitors_office']);
    $("#total_floor_area_office_required").html(class_default_values['metadata']['total_floor_area_office_required']);
    $("#recompute_office").click();
  } else if (asset_class == 'amenity') {
  $("#base_asset_subclass").val(class_default_values['metadata']['base_asset_subclass']);
  $("#amenity_m2_per_visitor").editable('setValue', class_default_values['metadata']['amenity_m2_per_visitor']);
  $("#amenity_floors").editable('setValue', class_default_values['metadata']['amenity_floors']);
  $("#total_daily_visitors_amenity").editable('setValue', class_default_values['metadata']['total_daily_visitors_amenity']);
  $("#total_floor_area_amenity_required").html(class_default_values['metadata']['total_floor_area_amenity_required']);
  $("#recompute_amenity").click();
}
  else if (asset_class == 'transport') {
    $("#base_asset_subclass").val(class_default_values['metadata']['base_asset_subclass']);
    $("#transport_passenger_trips").editable('setValue', class_default_values['metadata']['transport_passenger_trips']);
    $("#recompute_transport").click();
  }

  else if (asset_class == 'community') {
    $("#base_asset_subclass").val(class_default_values['metadata']['base_asset_subclass']);
    $("#community_visitors").editable('setValue', class_default_values['metadata']['community_visitors']);
    $("#community_residents").editable('setValue', class_default_values['metadata']['community_residents']);
    $("#recompute_community").click();
  }
  else if (asset_class = 'mixuse') {

    $("#base_asset_subclass").val(class_default_values['metadata']['base_asset_subclass']);
    $("#number_of_people_residential_mixuse").editable('setValue', class_default_values['metadata']['number_of_people_residential_mixuse']);
    $("#residential_units_mixuse").editable('setValue', class_default_values['metadata']['residential_units_mixuse']);
    $("#residential_floors_mixuse").editable('setValue', class_default_values['metadata']['residential_floors_mixuse']);
    if (class_default_values['metadata'].hasOwnProperty('residential_far_mixuse')) {
      $("#residential_far_mixuse").editable('setValue', class_default_values['metadata']['residential_far_mixuse']);
    } else {
      $("#residential_far_mixuse").editable('setValue', 0.6);
    }
    $("#current_pop_density_mixuse").html(class_default_values['metadata']['current_pop_density']);

    $("#base_asset_subclass").val(class_default_values['metadata']['base_asset_subclass']);
    $("#retail_m2_per_visitor_mixuse").editable('setValue', class_default_values['metadata'][
      'retail_m2_per_visitor_mixuse'
    ]);
    $("#retail_floors_mixuse").editable('setValue', class_default_values['metadata']['retail_floors_mixuse']);
    $("#total_daily_visitors_retail_mixuse").editable('setValue', class_default_values['metadata']['total_daily_visitors_retail_mixuse']);

    $("#percent_interested_in_luxury_retail_mixuse").editable('setValue', class_default_values['metadata']['percent_interested_in_luxury_retail_mixuse']);
    $("#total_daily_visitors_retail_mixuse").editable('setValue', class_default_values['metadata']['total_daily_visitors_retail_mixuse']);
    $("#percent_interested_in_support_retail_mixuse").editable('setValue', class_default_values['metadata']['percent_interested_in_support_retail_mixuse']);
    $("#total_daily_visitors_retail_mixuse").editable('setValue', class_default_values['metadata']['total_daily_visitors_retail_mixuse']);
    $("#percent_interested_in_fmcg_retail_mixuse").editable('setValue', class_default_values['metadata']['percent_interested_in_fmcg_retail_mixuse']);
    $("#percent_interested_in_food_retail_mixuse").editable('setValue', class_default_values['metadata']['percent_interested_in_food_retail_mixuse']);
    $("#total_floor_area_retail_required_mixuse").html(class_default_values['metadata']['total_floor_area_retail_required_mixuse']);
    $("#recompute_mixuse").click();
  }

  if (class_default_values['metadata'].hasOwnProperty('representative_image')) {
    const img_src = class_default_values['metadata']['representative_image'];
    if (img_src) {
      const img = "<img src='assets/img/asset-images/" + img_src + "'/>";
      $("#selected_typology_image").html(img);
      representative_image = img_src;

    }
  }
}




$('#savevalues_asset').on('click', function (e) {
            
  const base_asset_class = $("#base_asset_class option:selected").attr('data-value');
  var metadata = {};
  var asset_details = {};
  if (base_asset_class) {
      if (base_asset_class == 'residential') {
          metadata['base_asset_subclass'] = $("#base_asset_subclass").val();
          metadata['number_of_people_residential'] = parseInt($("#number_of_people_residential").editable('getValue', true));
          metadata['residential_units'] = parseInt($("#residential_units").editable('getValue', true));
          metadata['residential_floors'] = parseInt($("#residential_floors").editable('getValue',true));
          metadata['residential_far'] = parseFloat($("#residential_far").editable('getValue',true));
          metadata['current_pop_density'] = $("#current_pop_density").html();
      } else if (base_asset_class == 'hospitality') {
          metadata['base_asset_subclass'] = $("#base_asset_subclass").val();
          metadata['tourism_m2_per_guest'] = parseInt($("#tourism_m2_per_guest").editable('getValue',true));
          metadata['tourism_floors'] = parseInt($("#tourism_floors").editable('getValue', true));
          metadata['tourism_land_area'] = parseInt($("#tourism_land_area").editable('getValue', true));
          metadata['tourism_people_per_room'] = parseInt($("#tourism_people_per_room").editable('getValue', true));
          metadata['target_occupancy_rate'] = parseFloat($("#target_occupancy_rate").editable('getValue', true));
          metadata['tourism_total_rooms'] = parseInt($("#tourism_total_rooms").html());
          metadata['total_yearly_visitors'] = parseInt($("#total_yearly_visitors").html());
          metadata['direct_employees_to_visitor_ratio_tourism'] = parseFloat($("#direct_employees_to_visitor_ratio_tourism").editable('getValue', true));
          metadata['indirect_to_direct_employees_ratio_tourism'] = parseFloat($("#indirect_to_direct_employees_ratio_tourism").editable('getValue', true));
          metadata['total_direct_employment_tourism'] = $("#total_direct_employment_tourism").html();
          metadata['total_indirect_employment_tourism'] = $("#total_indirect_employment_tourism").html();

      } else if (base_asset_class == 'retail') {
          metadata['base_asset_subclass'] = $("#base_asset_subclass").val();
          metadata['retail_m2_per_visitor'] = parseInt($("#retail_m2_per_visitor").editable('getValue', true));
          metadata['retail_floors'] = parseInt($("#retail_floors").editable('getValue', true));
          metadata['total_daily_visitors_retail'] = parseInt($("#total_daily_visitors_retail").editable('getValue', true));
          metadata['percent_interested_in_luxury_retail'] = parseFloat($("#percent_interested_in_luxury_retail").editable('getValue', true));
          metadata['total_daily_visitors_retail'] = parseInt($("#total_daily_visitors_retail").editable('getValue', true));
          metadata['percent_interested_in_support_retail'] = parseFloat($("#percent_interested_in_support_retail").editable('getValue', true));
          metadata['total_daily_visitors_retail'] = parseFloat($("#total_daily_visitors_retail").editable('getValue', true));
          metadata['percent_interested_in_fmcg_retail'] = parseFloat($("#percent_interested_in_fmcg_retail").editable('getValue', true));
          metadata['percent_interested_in_food_retail'] = parseFloat($("#percent_interested_in_food_retail").editable('getValue', true));
          metadata['direct_employees_to_visitor_ratio_retail'] = parseFloat($("#direct_employees_to_visitor_ratio_retail").editable('getValue', true));
          metadata['indirect_to_direct_employees_ratio_retail'] = parseFloat($("#indirect_to_direct_employees_ratio_retail").editable('getValue', true));
          metadata['total_floor_area_retail_required'] = $("#total_floor_area_retail_required").html();
          metadata['total_direct_employment_retail'] = $("#total_direct_employment_retail").html();
          metadata['total_indirect_employment_retail'] = $("#total_indirect_employment_retail").html();
      } else if (base_asset_class == 'office') {
          metadata['base_asset_subclass'] = $("#base_asset_subclass").val();
          metadata['office_m2_per_visitor'] = parseInt($("#office_m2_per_visitor").editable('getValue', true));
          metadata['office_floors'] = parseInt($("#office_floors").editable('getValue', true));
          metadata['total_daily_visitors_office'] = parseInt($("#total_daily_visitors_office").editable('getValue', true));
          metadata['total_floor_area_office_required'] = $("#total_floor_area_office_required").val();                   
          metadata['indirect_to_direct_employees_ratio'] = $("#indirect_to_direct_employees_ratio_office").html();
          metadata['direct_employees_to_visitor_ratio'] = $("#direct_employees_to_visitor_ratio_office").html();
          metadata['total_direct_employment_office'] = $("#total_direct_employment_office").html();
          metadata['total_indirect_employment_office'] = $("#total_indirect_employment_office").html();
      }else if (base_asset_class == 'amenity') {
        metadata['base_asset_subclass'] = $("#base_asset_subclass").val();
        metadata['amenity_m2_per_visitor'] = parseInt($("#amenity_m2_per_visitor").editable('getValue', true));
        metadata['amenity_floors'] = parseInt($("#amenity_floors").editable('getValue', true));
        metadata['total_daily_visitors_amenity'] = parseInt($("#total_daily_visitors_amenity").editable('getValue', true));
        metadata['total_floor_area_amenity_required'] = $("#total_floor_area_amenity_required").val();                   
        metadata['indirect_to_direct_employees_ratio'] = $("#indirect_to_direct_employees_ratio_amenity").html();
        metadata['direct_employees_to_visitor_ratio'] = $("#direct_employees_to_visitor_ratio_amenity").html();
        metadata['total_direct_employment_amenity'] = $("#total_direct_employment_amenity").html();
        metadata['total_indirect_employment_amenity'] = $("#total_indirect_employment_amenity").html();
    }
      else if (base_asset_class == 'transport') {
          metadata['base_asset_subclass'] = $("#base_asset_subclass").val();
          metadata['transport_passenger_trips'] = parseInt($("#transport_passenger_trips").editable('getValue', true));
      }  
      else if (base_asset_class == 'agriculture') {
          metadata['base_asset_subclass'] = $("#base_asset_subclass").val();
      }
      else if (base_asset_class == 'green_infrastructure') {
          metadata['base_asset_subclass'] = $("#base_asset_subclass").val();
      }
      else if (base_asset_class == 'community') {
          metadata['base_asset_subclass'] = $("#base_asset_subclass").val();
          metadata['community_residents'] = parseInt($("#community_residents").editable('getValue', true));
          metadata['community_visitors'] = parseInt($("#community_visitors").editable('getValue', true));
      }
      else if (base_asset_class == 'mixuse') {
          metadata['base_asset_subclass'] = $("#base_asset_subclass").val();                    
          metadata['number_of_people_residential_mixuse'] = parseInt($("#number_of_people_residential_mixuse").editable('getValue', true));
          metadata['residential_units_mixuse'] = parseInt($("#residential_units_mixuse").editable('getValue', true));
          metadata['residential_floors_mixuse'] = parseInt($("#residential_floors_mixuse").editable('getValue',true));
          metadata['residential_far_mixuse'] = parseFloat($("#residential_far_mixuse").editable('getValue',true));
          metadata['current_pop_density_mixuse'] = $("#current_pop_density_mixuse").html();
          metadata['retail_m2_per_visitor_mixuse'] = parseInt($("#retail_m2_per_visitor_mixuse").editable('getValue', true));
          metadata['retail_floors_mixuse'] = parseInt($("#retail_floors_mixuse").editable('getValue', true));
          metadata['total_daily_visitors_retail_mixuse'] = parseInt($("#total_daily_visitors_retail_mixuse").editable('getValue', true));
          metadata['percent_interested_in_luxury_retail_mixuse'] = parseFloat($("#percent_interested_in_luxury_retail_mixuse").editable('getValue', true));
          metadata['total_daily_visitors_retail_mixuse'] = parseInt($("#total_daily_visitors_retail_mixuse").editable('getValue', true));
          metadata['percent_interested_in_support_retail_mixuse'] = parseFloat($("#percent_interested_in_support_retail_mixuse").editable('getValue', true));
          metadata['total_daily_visitors_retail_mixuse'] = parseFloat($("#total_daily_visitors_retail_mixuse").editable('getValue', true));
          metadata['percent_interested_in_fmcg_retail_mixuse'] = parseFloat($("#percent_interested_in_fmcg_retail_mixuse").editable('getValue', true));
          metadata['percent_interested_in_food_retail_mixuse'] = parseFloat($("#percent_interested_in_food_retail_mixuse").editable('getValue', true));
          metadata['direct_employees_to_visitor_ratio_retail_mixuse'] = parseFloat($("#direct_employees_to_visitor_ratio_retail_mixuse").editable('getValue', true));
          metadata['indirect_to_direct_employees_ratio_retail_mixuse'] = parseFloat($("#indirect_to_direct_employees_ratio_retail_mixuse").editable('getValue', true));
          metadata['total_floor_area_retail_required_mixuse'] = $("#total_floor_area_retail_required_mixuse").html();
          metadata['total_direct_employment_retail_mixuse'] = $("#total_direct_employment_retail_mixuse").html();
          metadata['total_indirect_employment_retail_mixuse'] = $("#total_indirect_employment_retail_mixuse").html();
      }
      metadata['services'] = {};
      metadata['services']['hospital_beds']= $("#total_hospital_beds_raw").val();
      metadata['services']['total_police_stations']= $("#total_police_stations_raw").val();
      metadata['services']['total_firestations']= $("#total_firestations_raw").val();
      metadata['services']['total_schools']= $("#total_schools_raw").val();
      metadata['services']['total_energy_demand']= $("#total_energy_demand_raw").val();
      metadata['services']['total_water_demand']= $("#total_water_demand_raw").val();
      metadata['services']['total_green_spaces']= $("#total_green_space_raw").val();
      metadata['services']['total_sewage_demand']= $("#total_sewage_demand_raw").val();                
      metadata['services']['total_parking']= $("#total_parking_raw").val();
      metadata['services']['total_road_usage']= $("#total_road_usage_raw").val();
      metadata['services']['total_rail_usage']= $("#total_rail_usage_raw").val();

      metadata["representative_image"]= representative_image;
      asset_details = {
          'scenario':1, 
          'class': base_asset_class,
          'metadata': metadata
      };
  }
  const csrf = $("[name='_csrf']").val();
  const data = {
      "projectid": projectid,
      "diagramid": diagramid,
      "_csrf": csrf,
      "asset_details": JSON.stringify(asset_details)
  };

  var url = '/set_asset_details/';
  if (representative_image == "") {
    
    humane.log("Please set Asset Class and Type", {
      addnCls: 'humane-flatty-warning'
  });
  }
  else {
  var promise = $.ajax({
      url: url,
      type: 'POST',
      data: data
  });


  promise.done(function (data) {
      humane.log("Data successufully saved", {
          addnCls: 'humane-flatty-success'
      });
  });

  promise.fail(function (data) {
      humane.log("Error in saving data, the administrators have been notified", {
          addnCls: 'humane-flatty-error'
      });
  });
  }
});