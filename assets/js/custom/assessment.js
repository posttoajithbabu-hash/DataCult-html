/**
 * Assessment questionnaire - 90-second universal assessment
 * Vertical + pain selector drives relevance for Q4 (focus area) and Q5 (systems)
 * Output: roadmap for ONE priority domain
 * Tracked to Google Sheets + email notification
 */

(function () {
  'use strict';

  // Vertical-specific options for Q4 (focus area)
  var FOCUS_AREAS = {
    construction: [
      { value: 'rfis_submittals', label: 'RFIs/submittals' },
      { value: 'change_orders_claims', label: 'Change orders claims' },
      { value: 'cost_to_complete', label: 'Cost-to-complete / EAC' },
      { value: 'schedule_risk', label: 'Schedule risk / lookahead' },
      { value: 'weekly_exec_reporting', label: 'Weekly exec reporting' },
      { value: 'other', label: 'Other', isOther: true }
    ],
    retail: [
      { value: 'availability_stockouts', label: 'Availability/stockouts' },
      { value: 'fulfillment_exceptions', label: 'Fulfillment exceptions (OTIF, delays)' },
      { value: 'returns_refunds', label: 'Returns/refunds' },
      { value: 'promo_performance', label: 'Promo performance' },
      { value: 'demand_planning_bias', label: 'Demand planning bias' },
      { value: 'other', label: 'Other', isOther: true }
    ],
    manufacturing: [
      { value: 'downtime_oee', label: 'Downtime/OEE' },
      { value: 'maintenance_work_orders', label: 'Maintenance work orders (CMMS)' },
      { value: 'scrap_rework_yield', label: 'Scrap/rework/yield' },
      { value: 'throughput_drift', label: 'Throughput drift / schedule adherence' },
      { value: 'spares_inventory', label: 'Spares/inventory' },
      { value: 'other', label: 'Other', isOther: true }
    ]
  };

  // Vertical-specific system add-ons for Q5
  var SYSTEMS_ADDONS = {
    construction: [
      'Procore',
      'Autodesk Construction Cloud',
      'Primavera P6',
      'MS Project',
      'Sage/CMiC/Viewpoint/Deltek',
      'Bluebeam'
    ],
    retail: [
      'D365 Commerce',
      'POS',
      'WMS',
      'OMS',
      'eCommerce platform',
      'Logistics/Last-mile',
      'Ticketing (Zendesk etc.)'
    ],
    manufacturing: [
      'MES/SCADA',
      'Historian',
      'CMMS-EAM (Maximo/SAP PM/Infor EAM)',
      'QMS',
      'LIMS'
    ]
  };

  // Config: Replace with your Google Apps Script web app URL for Sheets + email
  // Deploy as web app: File > Deploy > New deployment > Web app
  var SUBMIT_URL = ''; // e.g. 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'

  var $form = $('#assessmentForm');
  var $steps = $form.find('.assessment-step');
  var $btnPrev = $('#btnPrev');
  var $btnNext = $('#btnNext');
  var $btnSubmit = $('#btnSubmit');
  var $progressBar = $('#progressBar');
  var $currentQuestion = $('#currentQuestion');
  var $formSection = $('.assessment-form-section');
  var $successSection = $('#assessmentSuccess');
  var currentStep = 1;
  var totalSteps = 10;

  function getVertical() {
    return $form.find('input[name="vertical"]:checked').val();
  }

  function renderFocusAreaOptions() {
    var vertical = getVertical();
    var $container = $('#focusAreaOptions');
    $container.empty();

    if (!vertical) {
      $container.html('<p class="assessment-select-vertical-msg">Please select your vertical in Q1 first.</p>');
      return;
    }

    var options = FOCUS_AREAS[vertical] || [];
    options.forEach(function (opt) {
      var $label = $('<label class="assessment-option"></label>');
      var $input = $('<input type="radio" name="focus_area" value="' + opt.value + '" required>');
      var $span = $('<span class="assessment-option-label">' + opt.label + '</span>');
      $label.append($input).append($span);
      $container.append($label);

      if (opt.isOther) {
        var $otherWrap = $('<div class="assessment-option-other" style="margin-top:8px; display:none;"></div>');
        var $otherInput = $('<input type="text" name="focus_area_other" class="assessment-input-other" placeholder="Specify">');
        $otherWrap.append($otherInput);
        $label.after($otherWrap);
        $input.on('change', function () {
          $otherWrap.toggle($(this).is(':checked'));
        });
      }
    });
  }

  function renderSystemsAddons() {
    var vertical = getVertical();
    var $container = $('#systemsVerticalAddons');
    $container.empty();

    if (!vertical) return;

    var addons = SYSTEMS_ADDONS[vertical] || [];
    addons.forEach(function (label) {
      var val = label.toLowerCase().replace(/[^a-z0-9]/g, '_');
      var $label = $('<label class="assessment-option"></label>');
      var $input = $('<input type="checkbox" name="systems" value="' + val + '">');
      var $span = $('<span class="assessment-option-label">' + label + '</span>');
      $label.append($input).append($span);
      $container.append($label);
    });
  }

  function updateVerticalDependentQuestions() {
    renderFocusAreaOptions();
    renderSystemsAddons();
  }

  $form.find('input[name="vertical"]').on('change', updateVerticalDependentQuestions);

  function validateStep(stepNum) {
    var $step = $steps.filter('[data-step="' + stepNum + '"]');
    var $required = $step.find('input[required], input:required');
    var valid = true;

    $required.each(function () {
      var $el = $(this);
      if ($el.attr('type') === 'radio' || $el.attr('type') === 'checkbox') {
        var name = $el.attr('name');
        if (!$step.find('input[name="' + name + '"]:checked').length) {
          valid = false;
          return false;
        }
      } else if (!$el.val() || !$el.val().trim()) {
        valid = false;
        return false;
      }
    });

    if (stepNum === 5) {
      var $systemsChecked = $step.find('input[name="systems"]:checked');
      if (!$systemsChecked.length) valid = false;
    }

    return valid;
  }

  function showStep(stepNum) {
    if (stepNum === 4 || stepNum === 5) {
      updateVerticalDependentQuestions();
    }

    $steps.removeClass('active');
    $steps.filter('[data-step="' + stepNum + '"]').addClass('active');

    currentStep = stepNum;
    $btnPrev.prop('disabled', stepNum <= 1);
    $btnNext.toggle(stepNum < totalSteps);
    $btnSubmit.toggle(stepNum === totalSteps);

    var progressPct = (stepNum / totalSteps) * 100;
    $progressBar.css('width', progressPct + '%').attr('aria-valuenow', stepNum);
    $currentQuestion.text(stepNum);
  }

  function goNext() {
    if (!validateStep(currentStep)) {
      return;
    }

    if (currentStep < totalSteps) {
      showStep(currentStep + 1);
    }
  }

  function goPrev() {
    if (currentStep > 1) {
      showStep(currentStep - 1);
    }
  }

  $btnNext.on('click', goNext);
  $btnPrev.on('click', goPrev);

  $form.on('submit', function (e) {
    e.preventDefault();

    if (!validateStep(currentStep)) {
      return;
    }

    var payload = collectFormData();

    if (SUBMIT_URL) {
      $btnSubmit.prop('disabled', true).text('Submitting...');

      var $formPost = $('<form method="POST" action="' + SUBMIT_URL + '" target="assessment_submit_frame" style="display:none;"></form>');
      $formPost.append($('<input>').attr({ type: 'hidden', name: 'data', value: JSON.stringify(payload) }));
      $('body').append($formPost);

      var $iframe = $('#assessment_submit_frame');
      if (!$iframe.length) {
        $iframe = $('<iframe name="assessment_submit_frame" id="assessment_submit_frame" style="display:none;"></iframe>');
        $('body').append($iframe);
      }

      $formPost[0].submit();
      setTimeout(function () {
        $formPost.remove();
        showSuccess();
        $btnSubmit.prop('disabled', false).text('Submit Assessment');
      }, 1500);
    } else {
      console.log('Assessment payload (configure SUBMIT_URL for Sheets + email):', payload);
      showSuccess();
    }
  });

  function collectFormData() {
    var data = {
      timestamp: new Date().toISOString(),
      vertical: $form.find('input[name="vertical"]:checked').val(),
      role: $form.find('input[name="role"]:checked').val(),
      outcome: $form.find('input[name="outcome"]:checked').val(),
      focus_area: $form.find('input[name="focus_area"]:checked').val(),
      focus_area_other: $form.find('input[name="focus_area_other"]').val() || '',
      systems: [],
      systems_other: $('#systemsOther').val() || '',
      connectivity: $form.find('input[name="connectivity"]:checked').val(),
      cadence: $form.find('input[name="cadence"]:checked').val(),
      blocker: $form.find('input[name="blocker"]:checked').val(),
      readiness: $form.find('input[name="readiness"]:checked').val(),
      email: $('#assessmentEmail').val(),
      name: $('#assessmentName').val(),
      company: $('#assessmentCompany').val()
    };

    $form.find('input[name="systems"]:checked').each(function () {
      var val = $(this).val();
      data.systems.push(val === 'other' ? $('#systemsOther').val() || 'Other' : val);
    });

    return data;
  }

  function showSuccess() {
    $formSection.hide();
    $('.assessment-banner-section').hide();
    $successSection.show();
  }

  $('#systemsOptions input[value="other"]').on('change', function () {
    $('#systemsOther').toggle($(this).is(':checked'));
  });

  showStep(1);
  updateVerticalDependentQuestions();
})();
