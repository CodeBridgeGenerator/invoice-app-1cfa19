// used in seeder
import client from "./restClient";
import config from "../resources/config.json";
import standard from "../resources/standard.json";
import _ from "lodash";

 const getRelations = (s) => {
  const l = String(s).split("_");
  if (l.length > 3 && l[l.length - 1] === "121") {
    return true;
  } else return false;
};

 const getServiceName = (s) => {
  const l = String(s).split("_");
  if (l.length > 3 && l[l.length - 1] === "121") {
    return l[l.length - 3];
  } else return "";
};

 const getPathName = (s) => {
  const l = String(s).split("_");
  if (l.length > 3 && l[l.length - 1] === "121") {
    return l[l.length - 2];
  } else return "";
};

 const getFieldName = (s) => {
  const l = String(s).split("_");
  if (l.length > 0) return l[0];
  else return s;
};

 const getFieldNameFromLabel = (l, service) => {
  const fieldList = _.find(service.schemaList, { label: l });
  return fieldList?.field || l;
};

 const compareFields = (data, serviceName, _schema) => {
  const requiredFields = _schema.data
    .filter((f) => f.properties?.required === true)
    .map((f) => f?.field);
  const objectIdFields = _schema.data
    .filter((f) => f.properties?.type === "ObjectId")
    .map((f) => f?.field);
  const isAllFieldsIncluded = Object.keys(data).every((f) =>
    requiredFields.includes(f)
  );
  const isAllObjectIdsValues = Object.keys(data).every(
    (f) => objectIdFields.includes(f) && String(data[f]).length === 12
  );
  const isAllRequiredObjectIdsValues = Object.keys(data).every(
    (f) =>
      objectIdFields.includes(f) &&
      requiredFields.includes(f) &&
      String(data[f]).length === 12
  );
  let service = _.find(config.services, { serviceName: serviceName });
  if (!service) {
    service = _.find(standard.services, { serviceName: serviceName });
  }

  const _data = _.mapKeys(data, (v, k) => getFieldNameFromLabel(k, service));
  // map the keys to the schema not the label

  return {
    _data,
    requiredFields,
    objectIdFields,
    isAllFieldsIncluded,
    isAllObjectIdsValues,
    isAllRequiredObjectIdsValues,
  };
};


export const SeederService = async (serviceInUseName, _data, promises, services, _schema, user) => {
  Object.entries(_data).forEach((v, k) => {
    if (getRelations(v[0])) {
      const serviceName = getServiceName(v[0]);
      const pathName = getPathName(v[0]);
      if (serviceName !== "" && pathName !== "" && !services.includes(serviceName)) {
        promises.push(client.service(serviceName).find({ strict: true }));
        services.push(serviceName);
      }
    }
  });
  if (promises.length > 0) {
    const allResults = await Promise.all(promises);
    Object.entries(_data).forEach((v, k) => {
      if (getRelations(v[0])) {
        const serviceName = getServiceName(v[0]);
        const index = services.indexOf(serviceName);
        const search = {};
        search[getPathName(v[0])] = v[1];
        const _theValue = _.find(allResults[index].data, search);
        if(_theValue._id) _data[v[0]] = _theValue._id;
      } 
    });
  }

  _data = _.mapKeys(_data, (v, k) => getFieldName(k));
  _data["createdBy"] = user._id;
  _data["updatedBy"] = user._id;
  const compared = compareFields(_data,serviceInUseName,_schema);
  _data = compared._data;
  const res = await client.service(serviceInUseName).create(_data);
  return res;
}

export default {
  SeederService
};
