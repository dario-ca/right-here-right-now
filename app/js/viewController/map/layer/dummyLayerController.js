function DummyLayerController() {
    var self = MapLayerController();


    var init = function() {

        //POPUP

        var popup = ExternalSvgViewController("resource/view/notification-popup.svg");
        self.view.append(popup);
        popup.view.width = 20;
        popup.view.height= 10;
        popup.view.title.text("prova");
        popup.view.subtitle.text("provaprova");
        popup.view.icon.imageSrc = "resource/sublayer/icon/assault.png";

        var position = self.project(41.866320,-87.64 );
        popup.view.x = position.x;
        popup.view.y = position.y;


        var popup2 = ExternalSvgViewController("resource/view/notification-popup.svg");
        self.view.append(popup2);
        popup2.view.width = 20;
        popup2.view.height= 10;
        popup2.view.title.text("prova");
        popup2.view.subtitle.text("provaprova");
        popup2.view.icon.imageSrc = "resource/sublayer/icon/assault.png";

        var position = self.project(41.866320,-87.64 );
        popup2.view.x = position.x;
        popup2.view.y = position.y;





        self.fixControllerSize(popup);


        //ICON

        var simpleIcon = SvgViewController();
        var image = UIImageView();
        image.imageSrc = "resource/sublayer/icon/assault.png";

        simpleIcon.view.width = self.defaultIconSize;
        simpleIcon.view.height = self.defaultIconSize;
        simpleIcon.view.append(image);
        simpleIcon.view.classed("dummy-icon", true);
        self.view.append(simpleIcon);

        var position2 = self.project(41.876320,-87.64 );
        simpleIcon.view.x = position2.x;
        simpleIcon.view.y = position2.y;

    }();

    return self;
}