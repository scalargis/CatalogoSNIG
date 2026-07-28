import React, { useState } from "react";
import { Checkbox, Group } from "@mantine/core";


const MapExtentFilter = ({ id, config, items, onChange }) => {

    const [relation, setRelation] = useState([...(items || [])]);

    const onRelationChange = (value, checked) => {
        const _relation = [];

        if (checked)
            _relation.push(value);

        setRelation(_relation);

        onChange({value: [..._relation]});
    }

    return (
        <React.Fragment>
            <label className="font-semibold">{config?.label || "Extensão do Mapa" }</label>
            <Group gap="lg" className="mt-0 mb-0 pb-0">
                <Checkbox label="Sobreposição"
                    checked={relation.includes('overlaps')}
                    onChange={(e) => onRelationChange('overlaps', e.currentTarget.checked)} />
                <Checkbox label="Dentro"
                    checked={relation.includes('within_bbox')}
                    onChange={(e) => onRelationChange('within_bbox', e.currentTarget.checked)} />
            </Group>
        </React.Fragment>
    )

}

MapExtentFilter.getQueryParameters = (items, config) => {
    const params = items?.length ? items[0] : null;
    return params;
}

export default MapExtentFilter;
