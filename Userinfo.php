<?php
header("Content-type: application/x-php", true);
$xml = simplexml_load_file("Userinfo.xml"); //In this line it create a SimpleXMLElement object with the source of the XML file. 
$sxe = new SimpleXMLElement($xml->asXML()); //The following lines will add a new child and others child inside the previous child created
$person = $sxe->addChild("COMMENT"); 
$person->addChild("DATA", $params); //This next line will overwrite the original XML file with new data added 
$sxe->asXML("Userinfo.xml");
$retxml = simplexml_load_file('Userinfo.xml');
print_r($retxml);
echo($retxml);
?>