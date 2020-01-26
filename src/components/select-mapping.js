import React, { useCallback, useState } from "react";
import {
  Button,
  Card,
  Frame,
  Loading,
  OptionList,
  Popover,
  FormLayout,
  Select,
  TextField,
  Collapsible,
  Stack,
  TextContainer,
  Icon
} from "@shopify/polaris";
import { CirclePlusMinor } from "@shopify/polaris-icons";
import { text } from "../i18n";
import * as _ from "lodash";
import * as helpers from "../helpers";
import axios from "axios";

export default function SelectMapping(props) {
  const [selected, setSelected] = useState(props.item.data.value);
  const [isLoading, setIsLoading] = useState(false);

  const onChangeSelectedOption = selectedValue => {
    setSelected(selectedValue);

    props.item.data.value = selectedValue;

    setIsLoading(true);
    console.log("selectedValue", selectedValue);
    props.item.data.value = selectedValue;
    const url = helpers.getURL("/mappings/" + props.item._id);
    console.log("Updating mapping", url);

    console.log("PUT", url);
    axios
      .put(url, {
        _id: props.item._id,
        "data.value": props.item.data.value
      })
      .then(response => {
        console.log("Mapping updated", response);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
        return null;
      });
  };

  const selectedLabel = () => {
    let elem = props.values.find(elem => elem.value === selected[0]);
    console.log(selected, elem);
    return elem ? elem.label : "Choose " + props.title;
  };

  const hasSelected = () => {
    return selected && selected.length ? true : false;
  };

  const test = [{}];
  const [active, setActive] = useState(false);

  const handleToggle = useCallback(() => setActive(active => !active), []);

  return (
    <div style={{ height: "auto" }}>
      <Card sectioned>
        <Stack vertical>
          <FormLayout>
            <FormLayout.Group condensed>
              <TextField
                label={text(_.get(props, "tem.data.type", "no_type"))}
                value={_.get(props, "item.data.name", "no_name")}
                disabled
              />
             
              <Select
                label={text("select_aliexpress_property")}
                options={props.item.data.values}
                onChange={onChangeSelectedOption}
                value={_.get(props, "item.data.value")}
                multiple={false}
                disabled={isLoading}
                key={_.get(props, "item.data.id")}
              />
            
              <Button
                onClick={handleToggle}
                ariaExpanded={active}
                ariaControls="basic-collapsible"
              >
                <Icon source={CirclePlusMinor} />
              </Button>
            </FormLayout.Group>
          </FormLayout>

          <Collapsible open={active} id="basic-collapsible">
            <TextContainer>
              Your mailing list lets you contact customers or visitors who have
              shown an interest in your store. Reach out to them with exclusive
              offers or updates about your products.
            </TextContainer>
          </Collapsible>
        </Stack>
      </Card>
    </div>
  );
}
