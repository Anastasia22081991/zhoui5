sap.ui.define([
    "at/clouddna/training03/zhoui5/controller/BaseController",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/core/routing/History"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, MessageBox, JSONModel, Fragment, History) {
        "use strict";

        return BaseController.extend("at.clouddna.training03.zhoui5.controller.Customer", {

            _fragmentList: {},
            bCreate: false,

            //Lebenszyklusmethoden:
            onInit: function () {  //Initialisierungsmethode
            this.setContentDensity();

                let oEditModel = new JSONModel({ /*Für Zwischenspeichern von Edit/Display Mode*/
                    editMode: false  /*Auf Groß- und Kleinschreibung Achten! */
                });

                this.setModel(oEditModel, "editModel");
                
                //let oRouter = this.getOwnerComponent().getRouter();
                this.getRouter().getRoute("Customer").attachPatternMatched(this._onPatternMatched, this);
                this.getRouter().getRoute("CreateCustomer").attachPatternMatched(this._onCreatePatternMatched, this);
            },

            /*nPatternMatched-Funktion aus dem oEvent den übergebenen Pfad auslesen 
                und anschließend per bindElement auf die View binden.  */
            _onPatternMatched: function (oEvent) {
                this.bCreate = false;

                let sPath = oEvent.getParameters().arguments.path;
                this.sCustomerPath = decodeURIComponent(sPath);
                this.getView().bindElement(this.sCustomerPath);

                this.getModel("editModel").setProperty("/editMode", false);
                this._showCustomerFragment("DisplayCustomer");

            },
            _onCreatePatternMatched: function (oEvent) {
                this.bCreate = true;

                let oNewCustomerContext = this.getView().getModel().createEntry("/CustomerSet");
                this.getView().bindElement(oNewCustomerContext.getPath());
            
                this.getModel("editModel").setProperty("/editMode", true);
                this._showCustomerFragment("ChangeCustomer");
            },
            
            /*Zurückanvigation: */
            onNavBack: function(){
                var oHistory = History.getInstance();
                var sPreviousHash = oHistory.getPreviousHash();
            
                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {

                    this.getOwnerComponent().getRouter().navTo("Main");
                }
            },

            _showCustomerFragment: function (sFragmentName) {
                let oPage = this.getView().byId("page");

                oPage.removeAllContent();

                if (this._fragmentList[sFragmentName]) {
                    oPage.insertContent(this._fragmentList[sFragmentName]);
                } else {
                    Fragment.load({  
            /* Asynchrone Funktion, daher muss man warten und THIS(=Zeiger) mit bind "binden" */
                        id: this.getView().createId(sFragmentName),
                        name: "at.clouddna.training03.zhoui5.view.fragment." + sFragmentName,
                        controller: this
                    }).then(function (oFragment) {
                        this._fragmentList[sFragmentName] = oFragment;
                        oPage.insertContent(this._fragmentList[sFragmentName]);
                    }.bind(this)); 
            /*Hier wird This "gebunden" mit bind, damit man auf Variable zugreifen kann*/
                }
            },
/*
            onExit: function () { },
            onBeforeRendering: function () { },
            onAfterRendering: function () { },
            //ENDE Lebenszyklusmethoden
*/
            onEditPressed: function(){
                this._toggleEdit(true);
            },
            
            /* Die Methode _toggleEdit nimmt einen Boolean entgegen und 
            ändert je nach dem den Wert des Named-Models und fordert das Setzen des Fragments an */

            _toggleEdit: function(bEditMode){
                let oEditModel = this.getModel("editModel");
            
                oEditModel.setProperty("/editMode", bEditMode);
            
                this._showCustomerFragment(bEditMode ? "ChangeCustomer" : "DisplayCustomer");
            },

            onSavePressed: function () {
            
                //let oView = this.getView();
                let oModel = this.getModel();
                let oData = oModel.getData();

                let oResourceBundle = this.getModel("i18n").getResourceBundle();
                let sSuccessText = this.bCreate ? oResourceBundle.getText("dialog.create.success") : oResourceBundle.getText("dialog.edit.success");

                oModel.submitChanges({
                    success: (oData, response) => {
                        MessageBox.success(sSuccessText, {
                            onClose: () => {
                                if (this.bCreate) {
                                    this.onNavBack();
                                } else {
                                    this._toggleEdit(false);
                                }
                            }
                        });                        
                    },
                    error: (oError) => {
                        MessageBox.error(oError.message);
                    }
                })
            },

            onCancelPressed: function () {
                //let oModel = this.getView().getModel();
                let oModel = this.getModel();
                    oModel.resetChanges().then(() => {
                        if (this.bCreate) {
                            this.onNavBack();
                        } else {
                            this._toggleEdit(false);
                        }
                    });
            },

            genderFormatter: function (sGender) {
                //let oView = this.getView();
                let oI18nModel = this.getModel("i18n");
                let oResourceBundle = oI18nModel.getResourceBundle();

                switch (sGender) {
                    case "female":
                        return oResourceBundle.getText("female");
                    case "male":
                        return oResourceBundle.getText("male");
                    default:
                        return "?";
                }

            }
        });
    });
