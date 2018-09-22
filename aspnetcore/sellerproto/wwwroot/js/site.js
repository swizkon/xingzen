// Write your JavaScript code.

function sendPurchaseOrderTask(formComponent)
{
    var data = $(formComponent).serializeArray();
    sendJson("/Transactions/PlacePurchaseOrder", objectifyForm(data));
}

function sendJson(url, data)
{
    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(data),
        contentType: 'application/json',
        dataType: 'json',
      });
}


function objectifyForm(formArray) {
    var returnArray = {};
    for (var i = 0; i < formArray.length; i++) {
        returnArray[formArray[i]['name']] = formArray[i]['value'];
    }
    return returnArray;
}