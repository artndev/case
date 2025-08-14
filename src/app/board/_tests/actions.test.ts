import { createAdminClient } from '@/utils/supabase/admin'
import { v4 as uuidv4 } from 'uuid'
import {
  getWidgets,
  getWidgetType,
  I_Widget,
  I_WidgetType,
  saveWidgets,
  saveWidgetType,
  saveWidgetTypes,
} from '../actions'

const supabase = createAdminClient()
const widgetsExample = [
  { x: 5, y: 10, size: 'sm' },
  { x: 10, y: 15, size: 'md' },
  { x: 15, y: 20, size: 'sm' },
  { x: 20, y: 25, size: 'bg' },
] as I_Widget[]

describe('Integration Tests of Board Actions', () => {
  const userId = 'ff36cd73-dfc9-4436-b786-1148d3b56d1d'
  let widgetIdExample: string

  beforeAll(async () => {
    await supabase.from('widgets').delete().eq('user_id', userId)
  })

  it('saveWidgets', async () => {
    await saveWidgets(userId, widgetsExample, supabase)

    const res = await getWidgets(userId, supabase)
    expect(res.length).toBe(4)
    expect(res[0].user_id).toBe(userId)
    expect(res[1].user_id).toBe(userId)
    expect(res[2].user_id).toBe(userId)
    expect(res[3].user_id).toBe(userId)

    widgetIdExample = res[0].id
  })

  it('saveWidgetType', async () => {
    const widgetType = await saveWidgetType(
      {
        id: widgetIdExample,
        widget_type: 'widget-1',
      },
      supabase
    )
    expect(widgetType).toBe(true)

    const res = await getWidgetType(widgetIdExample, supabase)
    expect(res).not.toBeNull()
    expect(res!.widget_type).toBe('widget-1')
  })

  it('saveWidgetType_fake_id', async () => {
    const res = await saveWidgetType(
      {
        id: uuidv4(),
        widget_type: 'widget-1',
      },
      supabase
    )

    expect(res).toBe(false)
  })

  it('saveWidgetTypes', async () => {
    const widgets = await getWidgets(userId, supabase)
    const widgetTypes = widgets
      .filter(wgt => wgt.id !== widgetIdExample)
      .map(wgt => ({
        id: wgt.id,
        widget_type: 'widget-1',
      })) as I_WidgetType[]

    await saveWidgetTypes(widgetTypes, supabase)

    for (const wgt of widgets) {
      const res = await getWidgetType(wgt.id, supabase)
      expect(res).not.toBeNull()
      expect(res!.widget_type).toBe('widget-1')
    }
  })

  it('getWidgets', async () => {
    const res = await getWidgets(userId, supabase)
    expect(Array.isArray(res)).toBe(true)
    expect(res.length).toBeGreaterThan(0)
  })

  it('getWidgetType_invalid_id', async () => {
    const res = await getWidgetType('000-000-000', supabase)
    expect(res).toBeNull()
  })
})
