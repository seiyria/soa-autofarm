#r "System.Drawing.dll"

using System;
using System.Diagnostics;
using System.Drawing;
using System.Threading.Tasks;
using System.Runtime.InteropServices;

public class Startup
{
  public static byte[] GetRectShot(int x, int y, int w, int h)
  {
    Rectangle bounds = new Rectangle(x, y, x + w, y + h);
    Bitmap result = new Bitmap(w, h);

    using (Graphics graphics = Graphics.FromImage(result))
    {
        graphics.CopyFromScreen(new Point(x, y), Point.Empty, bounds.Size);
    }

    ImageConverter converter = new ImageConverter();
    return (byte[])converter.ConvertTo(result, typeof(byte[]));
  }

  public async Task<object> Invoke(Object[] xywh)
  {
    return GetRectShot((int)xywh[0], (int)xywh[1], (int)xywh[2], (int)xywh[3]);
  }
}