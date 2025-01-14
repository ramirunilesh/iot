import { deviceModel, IDevice } from '../models/device'

interface DeviceFilter extends DevicesFilter {
  name?: string
  _id?: string
  macAddress?: string
}

interface DevicesFilter {
  deviceType?: string
  mqttTopicDeviceName?: string
}

/**
 * Get one device record
 */
const getOne = async ({ name, _id, macAddress }: DeviceFilter): Promise<IDevice | null> => {
  let filter: DeviceFilter = {}
  if (name) filter = { ...filter, name }
  if (_id) filter = { ...filter, _id }
  if (macAddress) filter = { ...filter, macAddress }

  // find the latest one record for a specific device
  const device = await deviceModel.findOne(filter).sort({ createdAt: -1 }).exec()
  return device
}

/**
 * Get multiple device records
 */
const getMany = async ({
  deviceType,
  mqttTopicDeviceName,
}: DevicesFilter): Promise<IDevice[] | null> => {
  let filter: DevicesFilter = {}
  if (deviceType) filter = { ...filter, deviceType }
  if (mqttTopicDeviceName) filter = { ...filter, mqttTopicDeviceName }

  const devices = await deviceModel.find(filter).sort({ createdAt: -1 }).exec()
  return devices
}

export default {
  getOne,
  getMany,
}
