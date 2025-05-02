import { useEffect } from "react";
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
}

const Routing = ({ from, to }: RoutingProps) => {
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

    return () => {
      map.removeControl(routingControl);
    };
  }, [map, from, to]);

  return null;
};

export default Routing;