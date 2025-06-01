import { SetStateAction, useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

//find the road between two points
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

// Extend the leaflet module to include Routing
declare module "leaflet" {
  namespace Routing {
    function control(options: any): any;
  }
}

interface RoutingProps {
  from: [number, number];
  to: [number, number];
  onInstruction: React.Dispatch<SetStateAction<string[]>>;
}

const Routing = ({ from, to, onInstruction }: RoutingProps) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const routingControl = L.Routing.control({
      waypoints: [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])],
      routeWhileDragging: false,
      show: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      lineOptions: {
        styles: [
          { color: "blue", opacity: 0.8, weight: 5 }, 
        ],
      },

      createMarker: () => null, // Disable default marker creation
    }).addTo(map);

    //listen for the routes found
    routingControl.on("routesfound", (e: any) => {
      const route = e.routes[0];
      const instructions: string[] = [];

      route.instructions?.forEach((instruction: any) => {
        instructions.push(instruction.text);
      });

      // If no instructions array, fallback to segments
      if(!instructions.length && route?.instructions === null){
       route?.segments?.forEach((segment: any) => {
        instructions.push(segment.instruction.text);
       });
      }
      if(onInstruction){
        onInstruction(instructions);
      }
    });
    return () => {
      map.removeControl(routingControl);
    };
  }, [map, from, to]);

  return null;
};

export default Routing;