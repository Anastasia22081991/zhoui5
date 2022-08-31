sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, JSONModel, Fragment) {
        "use strict";

        return Controller.extend("at.clouddna.training03.zhoui5.controller.Customer", {

            _fragmentList: {},

            //Lebenszyklusmethoden:
            onInit: function () {  //Initialisierungsmethode
                let oEditModel = new JSONModel({ /*Für Zwischenspeichern von Edit/Display Mode*/
                    editMode: false  /*Auf Groß- und Kleinschreibung Achten! */
                });

                this.getView().setModel(oEditModel, "editModel");
                this._showCustomerFragment("DisplayCustomer");
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
                let oEditModel = this.getView().getModel("editModel");
            
                oEditModel.setProperty("/editMode", bEditMode);
            
                this._showCustomerFragment(bEditMode ? "ChangeCustomer" : "DisplayCustomer");
            },

            onSavePressed: function () {
                let oView = this.getView();
                let oModel = oView.getModel();
                let oData = oModel.getData();

                MessageBox.success(JSON.stringify(oData));

                this._toggleEdit(false);
            },

            onCancelPressed: function () {
                this._toggleEdit(false);
            },

            genderFormatter: function (sGender) {
                let oView = this.getView();
                let oI18nModel = oView.getModel("i18n");
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
