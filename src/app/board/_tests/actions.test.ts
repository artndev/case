import { createAdminClient } from '@/utils/supabase/admin'
import { v4 as uuidv4 } from 'uuid'
import {
  deleteWidget,
  getWidgets,
  getWidgetType,
  I_Widget,
  I_WidgetType,
  saveWidgets,
  saveWidgetType,
  saveWidgetTypes,
} from '../actions'

const supabase = createAdminClient()

const initialWidgets = [
  { x: 5, y: 10, size: 'sm' },
  { x: 10, y: 15, size: 'md' },
  { x: 15, y: 20, size: 'sm' },
  { x: 20, y: 25, size: 'bg' },
] as I_Widget[]

const fakeUUID = uuidv4()
  .split('-')
  .map(group => group.replaceAll(/\S/g, '0'))
  .join('-')
const invalidUUID = '000-000-000'

describe('Integration Tests of Board Actions', () => {
  let userId: string
  let widgetId: string

  beforeAll(async () => {
    const { error: widgetsDeleteError } = await supabase
      .from('widgets')
      .delete()
      .neq('id', fakeUUID)

    expect(widgetsDeleteError).toBe(null)

    const { error: profilesDeleteError } = await supabase
      .from('profiles')
      .delete()
      .neq('id', fakeUUID)

    expect(profilesDeleteError).toBe(null)

    const { data, error: profilesInsertError } = await supabase
      .from('profiles')
      .insert({
        email: 'test@example.com',
        casename: 'test',
      })
      .select()
      .maybeSingle()

    expect(profilesInsertError).toBe(null)
    expect(data).not.toBe(null)

    userId = data.id
  })

  it('saveWidgets_getWidgets', async () => {
    await saveWidgets(userId, initialWidgets, supabase)

    const res = await getWidgets(userId, supabase)
    expect(Array.isArray(res)).toBe(true)
    expect(res.length).toBeGreaterThan(0)
    expect(res.length).toBe(initialWidgets.length)
    expect(res.some(wgt => wgt.user_id === userId)).toBe(true)

    widgetId = res[0].id
  })

  it('saveWidgets_resave', async () => {
    const widgets = await getWidgets(userId, supabase)
    expect(widgets.length).toBeGreaterThan(0)

    await saveWidgets(
      userId,
      widgets.map(wgt => ({ ...wgt, size: 'sm' })),
      supabase
    )

    const res = await getWidgets(userId, supabase)
    expect(res.some(wgt => wgt.size === 'sm')).toBe(true)
  })

  it('saveWidgetType', async () => {
    const widgetType = await saveWidgetType(
      {
        id: widgetId,
        widget_type: 'widget-1',
      },
      supabase
    )
    expect(widgetType).toBe(true)

    const res = await getWidgetType(widgetId, supabase)
    expect(res).not.toBeNull()
    expect(res!.widget_type).toBe('widget-1')
  })

  it('getWidgetType_invalid_id', async () => {
    const res = await getWidgetType(invalidUUID, supabase)
    expect(res).toBeNull()
  })

  it('saveWidgetType_fake_id', async () => {
    const res = await saveWidgetType(
      {
        id: fakeUUID,
        widget_type: 'widget-1',
      },
      supabase
    )
    expect(res).toBe(false)
  })

  it('saveWidgetTypes', async () => {
    const widgets = await getWidgets(userId, supabase)
    expect(widgets.length).toBeGreaterThan(0)

    const widgetTypes = widgets
      .filter(wgt => wgt.id !== widgetId)
      .map(wgt => ({
        id: wgt.id,
        widget_type: 'widget-1',
      })) as I_WidgetType[]
    expect(widgetTypes.length).toBeGreaterThan(0)

    await saveWidgetTypes(widgetTypes, supabase)

    for (const wgt of widgets) {
      const res = await getWidgetType(wgt.id, supabase)
      expect(res).not.toBeNull()
      expect(res!.widget_type).toBe('widget-1')
    }
  })

  it('deleteWidget', async () => {
    const widgets = await getWidgets(userId, supabase)
    expect(widgets.length).toBeGreaterThan(0)

    const last = widgets[widgets.length - 1]
    await deleteWidget(last.id, supabase)

    const res = await getWidgets(userId, supabase)
    expect(res.length).toBe(widgets.length - 1)
    expect(res[res.length - 1]?.id !== last.id).toBe(true)
  })
})
