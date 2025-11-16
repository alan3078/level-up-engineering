import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">豐進裝修工程有限公司</h3>
            <p className="text-sm text-muted-foreground">
              專業裝修服務，為您打造理想家居
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">快速連結</h4>
            <ul className="space-y-1 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                  首頁
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="text-muted-foreground hover:text-foreground">
                  成本計算器
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-muted-foreground hover:text-foreground">
                  作品集
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">關於我們</h4>
            <ul className="space-y-1 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  公司簡介
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  聯絡我們
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">聯絡資訊</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>電話: +852 1234 5678</li>
              <li>電郵: info@example.com</li>
              <li>地址: 香港</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} 豐進裝修工程有限公司. 版權所有.</p>
        </div>
      </div>
    </footer>
  );
}

