import React, { useState } from "react";
import { Checkbox } from "primereact/checkbox";
import { RadioButton } from "primereact/radiobutton";


const MapExtentFilter = ({ id, config, items, onChange }) => {

    const [relation, setRelation] = useState([...(items || [])]);

    const onRelationChange = (e) => {
        const _relation = [];

        if (e.checked)
            _relation.push(e.value);

        setRelation(_relation);

        onChange({value: [..._relation]});
    }

    return (
        <React.Fragment>
            <label className="font-semibold">{config?.label || "Extensão do Mapa" }</label>
            <div className="card flex flex-wrap justify-content-left mt-0 mb-0 pb-0 gap-3">
                <div className="flex align-items-center">
                    <Checkbox inputId="ingredient1" name="relation" value="overlaps" onChange={onRelationChange} checked={relation.includes('overlaps')} />
                    <label htmlFor="ingredient1" className="ml-2">Sobreposição</label>
                </div>
                <div className="flex align-items-center">
                    <Checkbox inputId="ingredient2" name="relation" value="within_bbox" onChange={onRelationChange} checked={relation.includes('within_bbox')} />
                    <label htmlFor="ingredient2" className="ml-2">Dentro</label>
                </div>
            </div>
        </React.Fragment>
    )

}

MapExtentFilter.getQueryParameters = (items, config) => {
    const params = items?.length ? items[0] : null;
    return params;
}

export default MapExtentFilter;