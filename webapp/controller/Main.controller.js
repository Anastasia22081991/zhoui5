sap.ui.define(
    [
        "at/clouddna/training03/zhoui5/controller/BaseController",
        "sap/m/MessageBox"
    ],
    function(BaseController, MessageBox) {
      "use strict";
  
      return BaseController.extend("at.clouddna.training03.zhoui5.controller.Main", {
        onInit() {
            this.setContentDensity();
        },

        onDeleteButtonPressed: function(oEvent){
            let oModel = this.getView().getModel();
            let oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
        
            let oSource = oEvent.getSource();
            let sPath = oSource.getBindingContext().getPath();
        
            MessageBox.warning(oResourceBundle.getText("sureToDeleteQuestion"), {
                title: oResourceBundle.getText("sureToDeleteTitle"),
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                emphasizedAction: MessageBox.Action.YES,
                onClose: function(oAction){
                    if(MessageBox.Action.YES === oAction){
                        oModel.remove(sPath);
                    }
                }
            });
        },

        onListItemPressed: function(oEvent){
            let sPath = oEvent.getSource().getBindingContext().getPath();            
            this.getRouter().navTo("Customer",{
                path: encodeURIComponent(sPath)
            });
        },
        onCreatePressed: function(){
            this.getRouter().navTo("CreateCustomer", null, false);            
        }
 });
});
   